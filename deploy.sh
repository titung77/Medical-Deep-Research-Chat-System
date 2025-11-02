#!/bin/bash

# Medical Deep-Research Chat System - Quick Deploy Script
# This script helps you deploy the system quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Medical Deep-Research Chat System Deployment${NC}"
echo "================================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are available"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env || {
        print_error "Failed to create .env file"
        exit 1
    }
fi

print_status ".env file is ready"

# Validate API keys
if ! grep -q "SERPER_API_KEY=ebb93c8f37924c0ebb979860e8409e39b275b6d2" .env; then
    print_warning "Please make sure your SERPER_API_KEY is set in .env file"
fi

if ! grep -q "GEMINI_API_KEY=AlzaSyAjBABJxT7FCDy8zIOSUBcMrQYQoKiVN3M" .env; then
    print_warning "Please make sure your GEMINI_API_KEY is set in .env file"
fi

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p backend/uploads
print_status "Directories created"

# Build and start services
echo -e "\n${BLUE}🚀 Building and starting services...${NC}"

# Use docker compose (v2) or docker-compose (v1) based on availability
DOCKER_COMPOSE="docker compose"
if ! docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    else
        print_error "Neither 'docker compose' nor 'docker-compose' is available"
        exit 1
    fi
fi

print_status "Using: $DOCKER_COMPOSE"

# Stop existing containers
print_status "Stopping existing containers..."
$DOCKER_COMPOSE down 2>/dev/null || true

# Build and start
print_status "Building images..."
$DOCKER_COMPOSE build

print_status "Starting services..."
$DOCKER_COMPOSE up -d

# Wait for services to be ready
echo -e "\n${BLUE}⏳ Waiting for services to start...${NC}"
sleep 10

# Health checks
echo -e "\n${BLUE}🩺 Performing health checks...${NC}"

# Check Qdrant
if curl -f -s http://localhost:6333/health > /dev/null 2>&1; then
    print_status "Qdrant database is healthy"
else
    print_warning "Qdrant database might not be ready yet"
fi

# Check Backend
if curl -f -s http://localhost:2000/api/health > /dev/null 2>&1; then
    print_status "Backend API is healthy"
else
    print_warning "Backend API might not be ready yet"
fi

# Check Frontend
if curl -f -s http://localhost:1000 > /dev/null 2>&1; then
    print_status "Frontend is accessible"
else
    print_warning "Frontend might not be ready yet"
fi

# Display access information
echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
echo "================================================="
echo -e "${BLUE}Access your application:${NC}"
echo "• Frontend: http://localhost:1000"
echo "• Backend API: http://localhost:2000"
echo "• API Documentation: http://localhost:2000/docs"
echo "• Qdrant Dashboard: http://localhost:6333/dashboard"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "• View logs: $DOCKER_COMPOSE logs -f"
echo "• Stop services: $DOCKER_COMPOSE down"
echo "• Restart: $DOCKER_COMPOSE restart"
echo ""

# Test the system
read -p "Would you like to run a quick test? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}🧪 Testing the system...${NC}"
    
    # Test API
    echo "Testing API endpoint..."
    response=$(curl -s -X POST http://localhost:2000/api/chat \
        -H "Content-Type: application/json" \
        -d '{"message": "What is diabetes?"}' || echo "failed")
    
    if [[ "$response" != "failed" ]] && [[ "$response" == *"response"* ]]; then
        print_status "API test passed"
    else
        print_warning "API test failed - but services might need more time to start"
    fi
fi

echo -e "\n${GREEN}Setup complete! Visit http://localhost:1000 to start using the Medical Research Assistant.${NC}"
