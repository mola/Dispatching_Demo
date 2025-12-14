#!/bin/bash
set -e

echo "Building gas network simulation application..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv --system-site-packages
fi

# Install/upgrade Python dependencies with compatible versions
echo "Installing Python dependencies..."
./venv/bin/pip install --upgrade "pydantic>=2.0" "fastapi>=0.104.0" "uvicorn[standard]" sqlalchemy "pandapipes==0.9.0" "pandapower==2.14.11"

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Initialize database with example
echo "Setting up database with example network..."
./venv/bin/python setup_example.py

echo "Build complete!"
echo "To run the application: ./venv/bin/python main.py"
echo "Then open http://localhost:8000 in your browser"