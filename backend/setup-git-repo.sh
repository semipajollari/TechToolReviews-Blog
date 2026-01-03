#!/bin/bash

# Setup script to initialize backend as a separate git repository
# This script should be run from within the backend directory

set -e

echo "🚀 Setting up TechToolReviews Backend as a separate git repository..."

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
git init

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "⚠️  Warning: .gitignore not found. Creating a basic one..."
    cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
*.log
EOF
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Backend API server"

# Add remote origin
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/semipajollari/techtoolreviews-backend.git

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
echo "      https://github.com/semipajollari/techtoolreviews-backend.git"
echo ""
echo "   2. Push your code to the remote repository:"
echo "      git push -u origin main"
echo ""
echo "   3. If the repository is empty, you can push directly."
echo "      If it has content, you may need to pull first:"
echo "      git pull origin main --rebase"
echo "      git push -u origin main"
echo ""
