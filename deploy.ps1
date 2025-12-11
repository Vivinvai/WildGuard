#!/usr/bin/env pwsh
# WildGuard 4.0 - One-Click Deployment Script
# This script deploys WildGuard to Railway + Vercel

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🚀 WildGuard 4.0 Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green

# Check Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python: $(python --version)" -ForegroundColor Green

# Check Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found. Please install Git" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git installed" -ForegroundColor Green

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Choose Deployment Option:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "1. Deploy to Railway + Vercel (Cloud - Recommended)" -ForegroundColor White
Write-Host "2. Deploy with Docker (Local/VPS)" -ForegroundColor White
Write-Host "3. Deploy Locally (Development)" -ForegroundColor White
Write-Host "4. Just build and prepare for manual deployment" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🌐 Cloud Deployment Selected" -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        
        # Check if Railway CLI is installed
        if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
            Write-Host "⚠️  Railway CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g @railway/cli
        }
        
        # Check if Vercel CLI is installed
        if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host ""
        Write-Host "📦 Building project..." -ForegroundColor Yellow
        npm install
        npm run build
        
        Write-Host ""
        Write-Host "🚂 Deploying to Railway (Backend + AI Services)..." -ForegroundColor Yellow
        Write-Host "You'll need to:"
        Write-Host "1. Login to Railway" -ForegroundColor White
        Write-Host "2. Create a new project" -ForegroundColor White
        Write-Host "3. Add PostgreSQL database" -ForegroundColor White
        Write-Host "4. Configure environment variables" -ForegroundColor White
        Write-Host ""
        Read-Host "Press Enter to open Railway dashboard"
        Start-Process "https://railway.app/new"
        
        Write-Host ""
        Write-Host "▲ Deploying to Vercel (Frontend)..." -ForegroundColor Yellow
        Write-Host "You'll need to:"
        Write-Host "1. Login to Vercel" -ForegroundColor White
        Write-Host "2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "3. Configure VITE_API_URL environment variable" -ForegroundColor White
        Write-Host ""
        Read-Host "Press Enter to open Vercel dashboard"
        Start-Process "https://vercel.com/new"
        
        Write-Host ""
        Write-Host "✅ Deployment initiated!" -ForegroundColor Green
        Write-Host "📖 Check DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host ""
        Write-Host "🐳 Docker Deployment Selected" -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        
        # Check Docker
        if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Docker not found. Please install Docker Desktop" -ForegroundColor Red
            Start-Process "https://www.docker.com/products/docker-desktop"
            exit 1
        }
        
        Write-Host "✅ Docker found" -ForegroundColor Green
        Write-Host ""
        
        # Create .env if not exists
        if (!(Test-Path ".env")) {
            Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
            Copy-Item ".env.production.example" ".env"
            Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
            Read-Host "Press Enter after editing .env"
        }
        
        Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host ""
        Write-Host "🚀 Starting services..." -ForegroundColor Yellow
        docker-compose up -d
        
        Write-Host ""
        Write-Host "✅ Services started!" -ForegroundColor Green
        Write-Host "📊 View logs: docker-compose logs -f" -ForegroundColor Yellow
        Write-Host "🌐 Access app: http://localhost:5000" -ForegroundColor Yellow
        Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Yellow
    }
    
    "3" {
        Write-Host ""
        Write-Host "💻 Local Deployment Selected" -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        
        # Install dependencies
        Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "🐍 Installing Python dependencies..." -ForegroundColor Yellow
        
        # Check if virtual environment exists
        if (!(Test-Path ".venv")) {
            Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
            python -m venv .venv
        }
        
        Write-Host "Activating virtual environment..." -ForegroundColor Yellow
        & .\.venv\Scripts\Activate.ps1
        
        Write-Host "Installing Python packages..." -ForegroundColor Yellow
        pip install -r requirements.txt
        
        # Create .env if not exists
        if (!(Test-Path ".env")) {
            Write-Host ""
            Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
            Copy-Item ".env.production.example" ".env"
            Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
            Read-Host "Press Enter after editing .env"
        }
        
        # Setup database
        Write-Host ""
        Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
        Write-Host "Make sure PostgreSQL is running!" -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
        
        npm run db:push
        
        Write-Host ""
        Write-Host "✅ Setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Start all services with:" -ForegroundColor Yellow
        Write-Host "   .\START_ALL_SERVICES.ps1" -ForegroundColor White
        Write-Host ""
        Write-Host "Or start services individually:" -ForegroundColor Yellow
        Write-Host "   Terminal 1: npm run dev" -ForegroundColor White
        Write-Host "   Terminal 2: cd ai_models && python tensorflow_service.py" -ForegroundColor White
        Write-Host "   Terminal 3: cd Poaching_Detection && python yolo_poaching_service.py" -ForegroundColor White
        Write-Host "   Terminal 4: python injury-detection-service.py" -ForegroundColor White
    }
    
    "4" {
        Write-Host ""
        Write-Host "📦 Build and Prepare Selected" -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "Building frontend..." -ForegroundColor Yellow
        npm run build
        
        Write-Host ""
        Write-Host "Checking Python dependencies..." -ForegroundColor Yellow
        pip install --dry-run -r requirements.txt
        
        Write-Host ""
        Write-Host "Running tests..." -ForegroundColor Yellow
        npm run test
        
        Write-Host ""
        Write-Host "✅ Build complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📁 Files ready for deployment:" -ForegroundColor Yellow
        Write-Host "   - dist/ (frontend build)" -ForegroundColor White
        Write-Host "   - server/ (backend code)" -ForegroundColor White
        Write-Host "   - ai_models/ (AI services)" -ForegroundColor White
        Write-Host "   - Poaching_Detection/ (YOLO service)" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 See DEPLOYMENT_GUIDE.md for manual deployment steps" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables (API keys)" -ForegroundColor White
Write-Host "2. Test all services with health checks" -ForegroundColor White
Write-Host "3. Upload sample images to test AI features" -ForegroundColor White
Write-Host "4. Setup monitoring and alerts" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full documentation: DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
