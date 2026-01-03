#!/bin/bash

# Setup script to initialize backend as a separate git repository
# This script should be run from within the backend directory
#
# Usage:
#   ./setup-git-repo.sh [repository-url]
#
# Example:
#   ./setup-git-repo.sh https://github.com/semipajollari/techtoolreviews-backend.git

set -e

# Default repository URL
DEFAULT_REPO_URL="https://github.com/semipajollari/techtoolreviews-backend.git"
REPO_URL="${1:-$DEFAULT_REPO_URL}"

echo "🚀 Setting up TechToolReviews Backend as a separate git repository..."
echo "   Repository URL: $REPO_URL"

# Check if we're in the backend directory
if [ ! -f "server.js" ] || [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the backend directory"
    echo "   Please run: cd backend && ./setup-git-repo.sh"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed"
    exit 1
fi

# Check if already a git repository
if [ -d ".git" ]; then
    echo "⚠️  Warning: This directory is already a git repository"
    read -p "Do you want to reinitialize? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
    rm -rf .git
fi

# Initialize git repository
echo "📦 Initializing git repository..."
git init -b main 2>/dev/null || git init

# Check if git user is configured
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git user not configured. Setting up temporary local git config..."
    git config user.name "TechToolReviews"
    git config user.email "admin@techtoolreviews.com"
    echo "   ⚠️  IMPORTANT: Change this to your actual credentials:"
    echo "      git config user.name 'Your Name'"
    echo "      git config user.email 'your.email@example.com'"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "❌ Error: .gitignore file not found!"
    echo "   This repository should include a .gitignore file."
    echo "   Please ensure you have all the necessary files before running this script."
    exit 1
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Backend API server"

# Add remote origin
echo "🔗 Adding remote repository..."
git remote add origin "$REPO_URL"

# Check if main branch exists, if not rename master to main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
fi

echo ""
echo "✅ Git repository setup complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Make sure the remote repository exists at:"
echo "      $REPO_URL"
echo ""
echo "   2. Push your code to the remote repository:"
echo "      git push -u origin main"
echo ""
echo "   3. If the repository is empty, you can push directly."
echo "      If it has content, you may need to pull first:"
echo "      git pull origin main --rebase"
echo "      git push -u origin main"
echo ""
