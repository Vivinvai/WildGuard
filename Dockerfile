# WildGuard 4.0 - Multi-Service Docker Image
# Optimized for faster builds
# Includes: Node.js Backend + Python AI Services

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy only necessary source files
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY *.ts *.js *.json ./

# Build frontend
RUN npm run build

# Stage 2: Setup Python AI Services
FROM python:3.10-slim AS backend

WORKDIR /app

# Install system dependencies (minimal set)
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev \
    gcc \
    g++ \
    curl \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js in Python container
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install essential AI dependencies only
RUN pip install --no-cache-dir \
    flask==3.0.0 \
    flask-cors==4.0.0 \
    pillow==10.1.0 \
    numpy==1.24.3

# Copy Node.js production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend from builder
COPY --from=frontend-builder /app/dist ./dist

# Copy application code
COPY server ./server
COPY shared ./shared
COPY ai_models ./ai_models
COPY Poaching_Detection ./Poaching_Detection
COPY injury-detection-service.py ./

# Create directories for AI models
RUN mkdir -p ai_models/mobilenet_v2 Poaching_Detection/runs/detect/train2/weights

# Expose ports
# 5000: Main backend
# 5001: TensorFlow service (optional)
# 5002: Poaching detection (optional)
# 5004: Injury detection (optional)
EXPOSE 5000 5001 5002 5004

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start main backend (AI services can be started separately if needed)
CMD ["npm", "run", "start"]

