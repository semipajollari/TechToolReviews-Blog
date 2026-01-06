# =================================================================
# Vercel Environment Variables Setup Script (PowerShell)
# =================================================================
# For Windows users
# Run this script to set environment variables via Vercel CLI
# Prerequisites: npm install -g vercel
# =================================================================

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "❌ Vercel CLI not found. Install it first:" -ForegroundColor Red
    Write-Host "   npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 This will set environment variables for Production, Preview, and Development" -ForegroundColor Green
Write-Host ""

# Helper function to set env var
function Set-VercelEnv {
    param (
        [string]$Name,
        [string]$Value
    )
    
    Write-Host "Setting $Name..." -ForegroundColor Yellow
    $Value | vercel env add $Name production preview development
}

# Collect all variables
Write-Host "Please enter the following values:" -ForegroundColor Cyan
Write-Host ""

$RESEND_KEY = Read-Host "Enter your Resend API Key"
$FROM_EMAIL = Read-Host "Enter FROM_EMAIL (e.g., TechToolReviews <noreply@techtoolreviews.co>)"
$FRONTEND_URL = Read-Host "Enter FRONTEND_URL (e.g., https://techtoolreviews.co)"
$ADMIN_EMAIL = Read-Host "Enter ADMIN_EMAIL"
$MONGODB_URI = Read-Host "Enter MongoDB URI"
$JWT_SECRET = Read-Host "Enter JWT_SECRET (or leave blank to generate)"
if ([string]::IsNullOrWhiteSpace($JWT_SECRET)) {
    $JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "Generated JWT_SECRET: $JWT_SECRET" -ForegroundColor Green
}
$ADMIN_PASSWORD = Read-Host "Enter ADMIN_PASSWORD" -AsSecureString
$ADMIN_PASSWORD_TEXT = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($ADMIN_PASSWORD))

$CLOUDINARY_CLOUD_NAME = Read-Host "Enter Cloudinary Cloud Name"
$CLOUDINARY_API_KEY = Read-Host "Enter Cloudinary API Key"
$CLOUDINARY_API_SECRET = Read-Host "Enter Cloudinary API Secret" -AsSecureString
$CLOUDINARY_API_SECRET_TEXT = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($CLOUDINARY_API_SECRET))

Write-Host ""
Write-Host "🔧 Setting environment variables in Vercel..." -ForegroundColor Cyan
Write-Host ""

# Set all variables
Set-VercelEnv "EMAIL_SERVICE" "resend"
Set-VercelEnv "RESEND_API_KEY" $RESEND_KEY
Set-VercelEnv "FROM_EMAIL" $FROM_EMAIL
Set-VercelEnv "FRONTEND_URL" $FRONTEND_URL
Set-VercelEnv "ADMIN_EMAIL" $ADMIN_EMAIL
Set-VercelEnv "MONGODB_URI" $MONGODB_URI
Set-VercelEnv "JWT_SECRET" $JWT_SECRET
Set-VercelEnv "ADMIN_PASSWORD" $ADMIN_PASSWORD_TEXT
Set-VercelEnv "CLOUDINARY_CLOUD_NAME" $CLOUDINARY_CLOUD_NAME
Set-VercelEnv "CLOUDINARY_API_KEY" $CLOUDINARY_API_KEY
Set-VercelEnv "CLOUDINARY_API_SECRET" $CLOUDINARY_API_SECRET_TEXT

Write-Host ""
Write-Host "✅ All environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify domain in Resend dashboard" -ForegroundColor White
Write-Host "2. Add DNS records (SPF, DKIM, DMARC)" -ForegroundColor White
Write-Host "3. Deploy: vercel --prod" -ForegroundColor White
Write-Host "4. Test email functionality" -ForegroundColor White
Write-Host ""
Write-Host "📖 See QUICK_START_EMAIL_FIX.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
