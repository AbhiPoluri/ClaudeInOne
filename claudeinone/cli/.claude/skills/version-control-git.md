# Git Version Control

Source code management and collaboration.

## Git Basics

```bash
# Initialize repository
git init

# Clone repository
git clone https://github.com/user/repo.git

# Check status
git status

# Stage changes
git add .
git add src/file.ts

# Commit
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

## Branching Strategy

```bash
# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# List branches
git branch -a

# Delete branch
git branch -d feature/new-feature
git branch -D feature/force-delete

# Merge branch
git merge feature/new-feature

# Rebase (linear history)
git rebase main
```

## Advanced Git

```bash
# View commit history
git log --oneline --graph --all

# Check specific commit
git show abc123

# Revert commit
git revert abc123

# Cherry-pick commit
git cherry-pick abc123

# Stash changes
git stash
git stash list
git stash pop

# Interactive rebase
git rebase -i HEAD~5
```

## Git Workflows

```bash
# GitHub Flow (simple)
git checkout -b feature-branch
# Make changes
git commit -m "Add feature"
git push origin feature-branch
# Create Pull Request

# Git Flow (complex projects)
git checkout -b develop
git checkout -b release/1.0.0
git checkout -b hotfix/critical-bug
```

## Undoing Changes

```bash
# Undo unstaged changes
git checkout -- src/file.ts

# Undo staged changes
git reset HEAD src/file.ts

# Undo commit (keep changes)
git reset --soft HEAD~1

# Undo commit (discard changes)
git reset --hard HEAD~1

# Amend last commit
git commit --amend --no-edit
```

## Remote Management

```bash
# List remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Remove remote
git remote remove origin

# Fetch all remotes
git fetch --all
```

## Best Practices

✅ **Meaningful commits** - Clear commit messages
✅ **Small commits** - One feature per commit
✅ **Branch per feature** - Isolate work
✅ **Code review** - Pull request process
✅ **Protected main** - Require approvals

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git)
