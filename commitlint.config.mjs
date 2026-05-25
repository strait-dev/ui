// Conventional Commits, enforced locally by the lefthook `commit-msg` hook and
// mirrored by the PR-title check in CI. Keeping commit + PR subjects in this
// format is what lets the changelog and the categorized GitHub release notes
// (scripts/release-notes.mjs) bucket changes correctly.
export default {
  extends: ["@commitlint/config-conventional"],
};
