# WildGuard 4.0 - Multi-Service Docker Image
# Includes: Node.js Backend + Python AI Services

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Setup Python AI Services
FROM python:3.10-slim AS backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js in Python container
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install TensorFlow and AI dependencies
RUN pip install --no-cache-dir \
    tensorflow==2.20.0 \
    ultralytics \
    flask \
    flask-cors \
    pillow \
    numpy

# Copy Node.js dependencies
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/dist ./dist

# Copy application code
COPY . .

# Create directories for AI models if they don't exist
RUN mkdir -p ai_models/mobilenet_v2 Poaching_Detection/runs/detect/train2/weights

# Expose ports
# 5000: Main backend
# 5001: TensorFlow service
# 5002: Poaching detection
# 5004: Injury detection
EXPOSE 5000 5001 5002 5004

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start all services
CMD ["sh", "-c", "npm run start & python ai_models/tensorflow_service.py & python Poaching_Detection/yolo_poaching_service.py & python injury-detection-service.py & wait"]
