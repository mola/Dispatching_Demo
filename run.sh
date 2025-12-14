#!/bin/bash

# Simple build script for gas network simulation app
# This script builds frontend and sets up example

echo "Building Gas Network Simulation App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Go back to root directory
cd ..

# Create static directory if it doesn't exist
mkdir -p static

# Setup example network
echo "Setting up example network..."
python3 setup_example.py

echo "Build completed successfully!"
echo ""
echo "Note: Using system Python3 for backend (more stable with current packages)."
echo ""
echo "To run the application:"
echo "  python3 main.py"
echo ""
echo "Then open your browser to: http://localhost:8000"