# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Use GitHub's private
vulnerability reporting instead:

- Go to the repository's **Security** tab → **Report a vulnerability**, or visit
  <https://github.com/strait-dev/ui/security/advisories/new>.

We'll acknowledge the report, investigate, and coordinate a fix and disclosure
with you. (Maintainers: enable this channel under **Settings → Code security →
Private vulnerability reporting**.)

---

## Supply-chain hardening

`@strait/ui` is a public package, so a compromise of our build or release path
would flow straight to consumers. The repo is configured to make that hard.

### Dependencies

- **Release-age cooldown.** `bunfig.toml` sets `minimumReleaseAge = 259200`
  (3 days), so `bun add` / `bun update` refuse to resolve an npm version that was
  published less than three days ago. Most compromised releases are detected and
  yanked within hours; the cooldown keeps a freshly-poisoned version out of the
  lockfile. CI installs (`--frozen-lockfile`) are unaffected. To deliberately
  bypass the gate for one package, add it to `minimumReleaseAgeExcludes`.
- **Install scripts stay blocked.** Bun does not run a dependency's
  `preinstall`/`install`/`postinstall` scripts unless the package is in
  `trustedDependencies`. We keep that list empty, and
  `scripts/check-trusted-deps.mjs` (run in CI) fails the build if any workspace
  `package.json` grants trust to an unreviewed package. Trusting a package is a
  security decision: audit its install script, then add it to the `ALLOW` set in
  that script with a dated note.
- **No runtime dependencies are added casually.** New tooling is a
  `devDependency`; review what a dependency does before adding it.

### GitHub Actions

- **All actions are pinned to a full commit SHA**, not a movable tag, so a
  compromised tag re-point cannot inject code into our pipeline. The trailing
  `# vX.Y.Z` comment records the human-readable version. We pin manually — when
  bumping an action, resolve the new tag to its commit SHA and update both the
  SHA and the comment.
- **Least-privilege permissions.** Every workflow declares an explicit
  `permissions:` block. CI/Chromatic are `contents: read`; only the release and
  Pages workflows request write/`id-token` scopes, and only where required.
- **No `pull_request_target`.** Workflows run on `pull_request`, which uses the
  fork's read-only token and never exposes secrets to PR code.

### Publishing

- **OIDC trusted publishing — no npm tokens.** The release workflow publishes to
  npm via OIDC trusted publishing, so there is no long-lived `NPM_TOKEN` stored
  in the repo, and npm provenance is attached automatically. See
  [`RELEASING.md`](./RELEASING.md) for the full release flow.

---

## Maintainer settings checklist

Some protections live in npm/GitHub account settings and **cannot** be expressed
in this repo. Complete these once:

### npm (the `strait` org)

- [ ] **Require 2FA for all org members** (Org → Settings → require 2FA).
- [ ] Set `@strait/ui` publishing to **require 2FA or trusted publishing** and do
      **not** create classic automation tokens. Delete any bootstrap token after
      the first publish.
- [ ] Confirm the **trusted publisher** points at `strait-dev` / `ui` /
      `release.yml` (see `RELEASING.md`).

### GitHub (`strait-dev` org + this repo)

- [ ] **Require 2FA for all org members** (Org → Settings → Authentication
      security).
- [ ] **Settings → Actions → General → Fork pull request workflows:** require
      approval for **all external contributors** so a fork PR can't run CI (and
      reach any secrets) without a maintainer's click.
- [ ] **Settings → Code security → Private vulnerability reporting:** enable.
- [ ] **Branch protection on `main`:** require PRs, require status checks to
      pass, and disallow force-pushes.
- [ ] Keep the `RELEASE_ENABLED` repo variable unset until the npm package and
      trusted publisher are bootstrapped (see `RELEASING.md`).
