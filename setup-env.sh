#!/bin/bash

# =================================================================
# Vercel Environment Variables Setup Script
# =================================================================
# This script helps you set environment variables in Vercel CLI
# Make sure you have Vercel CLI installed: npm i -g vercel
# =================================================================

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

echo "📝 This will set environment variables for Production, Preview, and Development"
echo ""

# Set EMAIL variables
echo "Setting EMAIL_SERVICE..."
vercel env add EMAIL_SERVICE production preview development <<< "resend"

echo "Setting RESEND_API_KEY..."
read -p "Enter your Resend API Key: " RESEND_KEY
echo $RESEND_KEY | vercel env add RESEND_API_KEY production preview development

echo "Setting FROM_EMAIL..."
read -p "Enter FROM_EMAIL (e.g., TechToolReviews <noreply@techtoolreviews.co>): " FROM_EMAIL
echo "$FROM_EMAIL" | vercel env add FROM_EMAIL production preview development

# Set DOMAIN variables
echo "Setting FRONTEND_URL..."
read -p "Enter FRONTEND_URL (e.g., https://techtoolreviews.co): " FRONTEND_URL
echo "$FRONTEND_URL" | vercel env add FRONTEND_URL production preview development

echo "Setting ADMIN_EMAIL..."
read -p "Enter ADMIN_EMAIL: " ADMIN_EMAIL
echo "$ADMIN_EMAIL" | vercel env add ADMIN_EMAIL production preview development

# Set DATABASE
echo "Setting MONGODB_URI..."
read -p "Enter MongoDB URI: " MONGODB_URI
echo "$MONGODB_URI" | vercel env add MONGODB_URI production preview development

# Set ADMIN AUTH
echo "Setting JWT_SECRET..."
read -p "Enter JWT_SECRET (or press Enter to generate): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated: $JWT_SECRET"
fi
echo "$JWT_SECRET" | vercel env add JWT_SECRET production preview development

echo "Setting ADMIN_PASSWORD..."
read -sp "Enter ADMIN_PASSWORD: " ADMIN_PASSWORD
echo ""
echo "$ADMIN_PASSWORD" | vercel env add ADMIN_PASSWORD production preview development

# Set CLOUDINARY
echo "Setting CLOUDINARY_CLOUD_NAME..."
read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
echo "$CLOUDINARY_CLOUD_NAME" | vercel env add CLOUDINARY_CLOUD_NAME production preview development

echo "Setting CLOUDINARY_API_KEY..."
read -p "Enter Cloudinary API Key: " CLOUDINARY_API_KEY
echo "$CLOUDINARY_API_KEY" | vercel env add CLOUDINARY_API_KEY production preview development

echo "Setting CLOUDINARY_API_SECRET..."
read -sp "Enter Cloudinary API Secret: " CLOUDINARY_API_SECRET
echo ""
echo "$CLOUDINARY_API_SECRET" | vercel env add CLOUDINARY_API_SECRET production preview development

echo ""
echo "✅ All environment variables set!"
echo ""
echo "🔄 Next steps:"
echo "1. Verify domain in Resend dashboard"
echo "2. Add DNS records (SPF, DKIM, DMARC)"
echo "3. Deploy: vercel --prod"
echo "4. Test email functionality"
echo ""
