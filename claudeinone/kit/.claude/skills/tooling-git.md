# Git Workflows

## Overview
Branch strategies, commit conventions, and team workflows for effective version control.

## Conventional Commits

```bash
# Format: <type>(<scope>): <description>
git commit -m "feat(auth): add magic link authentication"
git commit -m "fix(api): handle null user in session middleware"
git commit -m "chore: update dependencies"
git commit -m "docs: add API authentication guide"
git commit -m "refactor(db): extract user repository pattern"
git commit -m "test(auth): add integration tests for login flow"
git commit -m "perf(queries): add index on user email column"
```

## Feature Branch Workflow

```bash
# Create feature branch from main
git checkout main && git pull origin main
git checkout -b feat/user-authentication

# Work and commit
git add src/auth/
git commit -m "feat(auth): implement JWT token generation"

# Keep branch updated
git fetch origin main
git rebase origin/main  # or merge

# Push for PR
git push -u origin feat/user-authentication
```

## Git Aliases (useful shortcuts)

```bash
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.br "branch --sort=-committerdate"
git config --global alias.save "!git add -A && git commit -m 'SAVEPOINT'"
```

## Commit Message Hook (commitlint)

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
echo "npx commitlint --edit $1" > .husky/commit-msg
```

## Git Flow Commands

```bash
# Start a release
git checkout -b release/1.2.0 main
npm version minor  # bumps package.json to 1.2.0

# Hotfix
git checkout -b hotfix/fix-login-crash main
git commit -m "fix: resolve null pointer in auth middleware"
git checkout main && git merge hotfix/fix-login-crash --no-ff
git tag -a v1.2.1 -m "Hotfix: login crash"
```

## Best Practices
- Use conventional commits for automated changelogs
- Squash commits before merging feature branches
- Protect `main` branch — require PRs and CI checks
- Write imperative commit messages: "Add feature" not "Added feature"

## Resources
- [Conventional Commits](https://www.conventionalcommits.org)
- [Pro Git book](https://git-scm.com/book)
