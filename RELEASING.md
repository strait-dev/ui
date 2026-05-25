# Releasing `@strait/ui`

`@strait/ui` is the only published package in this monorepo. Releases are driven
by [Changesets](https://github.com/changesets/changesets) and published to npm
from CI using **OIDC trusted publishing** — there is no long-lived npm token
stored in the repo. The Storybook workspace (`@strait/storybook`) is private and
excluded from versioning.

> See [`SECURITY.md`](./SECURITY.md) for the repo's full supply-chain hardening
> (dependency cooldown, SHA-pinned actions, install-script policy) and the
> one-time npm/GitHub account settings that back this pipeline.

---

## Day-to-day: shipping a change

1. Make your code change on a branch and open a PR.
2. Record the release intent:

   ```bash
   bun run changeset
   ```

   Pick the bump for `@strait/ui` — **patch** (fixes), **minor** (new,
   backwards-compatible components/props), or **major** (breaking changes) — and
   write a one-line summary. This creates a markdown file under `.changeset/`.
   Commit it with your PR.

   **Start the summary with a Conventional Commits type** (`feat:`, `fix:`,
   `perf:`, `refactor:`, `docs:`, …). The `check:changeset` gate enforces this,
   and the prefix is what sorts each entry into the right bucket (🚀 Features,
   🐛 Bug Fixes, ⚡ Performance, …) of the GitHub Release notes. Example:
   `fix: give the QRCode SVG an accessible name`.
3. Merge the PR into `main`.
4. The **Release** workflow (`.github/workflows/release.yml`) runs on `main` and
   opens (or updates) a **"Version Packages"** PR. That PR consumes all pending
   changesets, bumps the version in `packages/ui/package.json`, refreshes the
   lockfile, and updates `CHANGELOG.md`.
5. **Merge the "Version Packages" PR.** With no changesets left, the same
   workflow runs `changeset publish`, which publishes `@strait/ui` to npm with
   provenance and pushes the git tag. A follow-up step then publishes a
   **categorized GitHub Release** for that tag (see
   [GitHub Release notes](#github-release-notes-reference) below).

> The current starting version is **`0.1.0`**. A minor changeset takes it to
> `0.2.0`, a patch to `0.1.1`, and a major to `1.0.0`.

---

## One-time setup (maintainers)

These steps must be completed **once** before the automated pipeline can publish.
OIDC trusted publishing can only be configured on npmjs.com **after the package
already exists**, so the very first release is a manual bootstrap.

### 1. Create the npm org

- Sign in to <https://www.npmjs.com> and create the **`strait`** organization
  (this owns the `@strait` scope).
- Add the maintainers who should be able to publish.

### 2. Bootstrap the first publish (`0.1.0`)

Trusted publishing requires the package to exist first, so publish `0.1.0` once
using a traditional credential from a maintainer's machine:

```bash
# Authenticate as a member of the @strait org (with 2FA).
npm login

# Build + publish the package that is already at version 0.1.0.
bun run --filter @strait/ui build
cd packages/ui
npm publish --access public
```

`packages/ui` has `publishConfig.access: "public"` and a `prepublishOnly` build
hook, so the published tarball always contains a fresh `dist/`. Confirm the
result at <https://www.npmjs.com/package/@strait/ui>.

### 3. Configure the trusted publisher (switch to OIDC)

On npmjs.com, open the `@strait/ui` package → **Settings → Trusted Publisher**
and add a GitHub Actions publisher:

| Field             | Value                            |
| ----------------- | -------------------------------- |
| Organization/user | `strait-dev`                     |
| Repository        | `ui`                             |
| Workflow filename | `release.yml`                    |
| Environment       | _(leave blank)_                  |

### 4. Activate the automated pipeline

The Release workflow is gated behind a repo variable so it stays dormant until
the steps above are done (otherwise its first run would try to publish a package
that does not exist yet). Turn it on:

- GitHub → repo **Settings → Secrets and variables → Actions → Variables** →
  add `RELEASE_ENABLED` = `true`.
- (CLI equivalent: `gh variable set RELEASE_ENABLED --body true`.)

From this point on, every release goes through the Changesets flow above — no
npm token is ever needed in GitHub. You can delete any bootstrap token you
created.

---

## How the CI publish authenticates (reference)

The Release workflow grants `id-token: write`, installs **npm ≥ 11.5.1** (newer
than the npm bundled with Node 22, and the minimum that supports OIDC), and runs
with **no `NODE_AUTH_TOKEN`**. At publish time npm exchanges the GitHub OIDC
token with the registry, authenticates against the trusted publisher configured
above, and attaches provenance automatically.

`changeset publish` only special-cases pnpm; for every other package manager it
falls back to `npm publish`. That is why this bun-based repo still gets OIDC —
the actual publish is performed by npm, not by `bun publish` (which does not
support OIDC).

## GitHub Release notes (reference)

The CHANGELOG that Changesets writes is flat. To get readable, categorized
release notes we publish the GitHub Release ourselves instead of letting the
action do it:

- `release.yml` sets `createGithubReleases: false` on the `changesets/action`
  step and captures its `publishedPackages` output.
- When something publishes, a follow-up step runs
  `bun scripts/build-release-notes.mjs`, which reads
  `packages/ui/CHANGELOG.md`, parses the section for the just-published version,
  buckets each entry by its Conventional Commits prefix, appends an **Install**
  block + **Docs** link + **Full Changelog** compare link, and creates the
  release with `gh release create <tag>`.
- The pure formatter lives in `scripts/release-notes.mjs` and is unit-tested by
  `scripts/release-notes.test.mjs` (`bun run test:release-notes`); the CLI
  wrapper supports `--dry-run` to preview notes without publishing.

Because bucketing relies on the prefix, the `check:changeset` gate
(`scripts/check-changeset-format.mjs`) fails CI if any changeset summary is
missing a Conventional Commits type.

## Commit & PR hygiene (reference)

These gates keep history clean enough for the notes pipeline to read:

- **Commit messages** are linted by commitlint (`commitlint.config.mjs`,
  Conventional Commits) via a lefthook `commit-msg` hook. Hooks install
  automatically on `bun install` through the root `prepare` script.
- **PR titles** are checked by `.github/workflows/pr-checks.yml`
  (`amannn/action-semantic-pull-request`) so the squash-merge subject stays
  conventional.
- **A changeset must be present** on every PR. The same workflow runs
  `changeset status` against the base branch; add the **`skip-changeset`** label
  for releaseless PRs (docs-only, CI, repo chores) to bypass it.

## Re-baselining / troubleshooting

- **"Version Packages" PR never appears:** the merge to `main` had no
  `.changeset/*.md` files. Add one with `bun run changeset`.
- **Publish step fails with auth errors:** verify the trusted publisher fields
  exactly match `strait-dev` / `ui` / `release.yml`, and that the workflow run
  shows npm ≥ 11.5.1 in the "Upgrade npm" step.
- **Lockfile mismatch in the version PR:** the `version-packages` script runs
  `bun install` after `changeset version` to keep `bun.lock` in sync; if you
  bump versions manually, run `bun install` before committing.
