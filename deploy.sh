#!/bin/bash
# Deployment helper script

echo "🚀 ADFLO Traffic Marketplace - Deployment Setup"
echo "=================================================="
echo ""

# Check for required tools
echo "Checking prerequisites..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi
echo "✓ npm found"

if ! command -v git &> /dev/null; then
    echo "❌ git not found. Please install git"
    exit 1
fi
echo "✓ git found"

echo ""
echo "📋 Deployment Checklist:"
echo "1. Create Vercel account: https://vercel.com/signup"
echo "2. Create Render account: https://render.com/register"
echo "3. Ensure GitHub repo is public/accessible"
echo ""

echo "🔧 Configuration files created:"
echo "   ✓ vercel.json - Vercel frontend configuration"
echo "   ✓ render.yaml - Render backend configuration"
echo "   ✓ DEPLOYMENT_GUIDE.md - Complete deployment steps"
echo ""

echo "📝 Next steps:"
echo ""
echo "STEP 1: Push to GitHub"
echo "  git add ."
echo "  git commit -m 'Add deployment configuration'"
echo "  git push origin main"
echo ""
echo "STEP 2: Deploy Frontend"
echo "  → Go to https://vercel.com/import"
echo "  → Import your GitHub repository"
echo "  → Add environment variables (DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_API_URL)"
echo "  → Click Deploy"
echo ""
echo "STEP 3: Deploy Backend"
echo "  → Go to https://render.com/dashboard"
echo "  → Create PostgreSQL database"
echo "  → Create Web Service from GitHub"
echo "  → Add environment variables"
echo "  → Connect and Deploy"
echo ""
echo "STEP 4: Test"
echo "  → Open your Vercel frontend URL"
echo "  → Test login/register"
echo "  → Check API connectivity"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
