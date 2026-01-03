# Quick Setup Guide

This guide helps you set up the backend as a separate git repository.

## Automated Setup (Recommended)

Run the setup script from within the backend directory:

```bash
cd backend
./setup-git-repo.sh
```

Or specify a custom repository URL:

```bash
cd backend
./setup-git-repo.sh https://github.com/yourusername/your-backend-repo.git
```

The script will:
- Initialize a new git repository
- Configure git user settings if needed
- Create an initial commit with all backend files
- Add the remote repository URL
- Set up the main branch

After running the script, push your code:

```bash
git push -u origin main
```

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Initialize git repository
```bash
git init
```

### 3. Add all files
```bash
git add .
```

### 4. Create initial commit
```bash
git commit -m "Initial commit: Backend API server"
```

### 5. Rename branch to main (if needed)
```bash
git branch -M main
```

### 6. Add remote repository
```bash
git remote add origin https://github.com/semipajollari/techtoolreviews-backend.git
```

### 7. Push to remote
```bash
git push -u origin main
```

## Troubleshooting

### If remote repository already has content:
```bash
git pull origin main --rebase
git push -u origin main
```

### If you get authentication errors:
Make sure you have:
- Set up your GitHub credentials
- Have write access to the repository
- Configured your Git authentication method (SSH or HTTPS with token)

### To change git user settings:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Next Steps

After successfully pushing to the remote repository:

1. Set up any required secrets in GitHub (for CI/CD)
2. Configure deployment settings
3. Add collaborators if needed
4. Set up branch protection rules
5. Configure GitHub Actions for automated testing/deployment
