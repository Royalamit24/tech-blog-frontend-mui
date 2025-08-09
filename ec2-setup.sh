#!/bin/bash

# EC2 Setup Script for Tech Blog Frontend
# Run this script on your EC2 instance

echo "🚀 Setting up Tech Blog Frontend on EC2..."

# Check if GitHub repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide GitHub repository URL"
    echo "Usage: ./ec2-setup.sh https://github.com/USERNAME/REPO.git"
    exit 1
fi

GITHUB_REPO=$1

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Git
echo "📦 Installing Git..."
sudo apt install git -y

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Install Node.js and npm
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Create directory for frontend
echo "📁 Creating frontend directory..."
sudo mkdir -p /var/www/tech-blog-frontend
sudo chown -R $USER:$USER /var/www/tech-blog-frontend

# Clone repository
echo "📥 Cloning repository from GitHub..."
cd ~
git clone $GITHUB_REPO tech-blog-frontend-mui
cd tech-blog-frontend-mui

# Start and enable Nginx
echo "🔧 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Get the public IP automatically
echo "🔍 Detecting public IP address..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📍 Detected public IP: $PUBLIC_IP"

# Create environment file for the application
echo "📝 Creating environment configuration..."
cat > .env.production.local << EOF
REACT_APP_API_URL=http://$PUBLIC_IP:4005
REACT_APP_ENV=production
PUBLIC_IP=$PUBLIC_IP
EOF

# Install dependencies
echo "� Installing project dependencies..."
npm install

# Build the project
echo "🏗️ Building production version..."
npm run build

# Copy build files to web directory
echo "📁 Copying build files..."
cp -r build/* /var/www/tech-blog-frontend/

# Update nginx configuration with public IP
echo "⚙️ Configuring Nginx..."
sed -i "s/YOUR_EC2_PUBLIC_IP/$PUBLIC_IP/g" nginx.conf

# Configure Nginx
echo "🌐 Setting up Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/tech-blog
sudo ln -sf /etc/nginx/sites-available/tech-blog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "🔧 Testing and reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ EC2 setup completed!"
echo "📍 Your public IP: $PUBLIC_IP"
echo "🌐 Your app should be accessible at: http://$PUBLIC_IP"
echo ""
echo "🔧 Next steps:"
echo "1. ✅ Repository cloned and built"
echo "2. ✅ Nginx configured and running"
echo "3. 🔄 Start your backend API server on port 4005"
echo "4. 🔄 Make sure security groups allow HTTP (80) and API (4005)"
echo ""
echo "📋 To start your backend API (if you have one):"
echo "# Upload your backend code and run:"
echo "# cd ~/your-backend-project"
echo "# npm install"
echo "# pm2 start server.js --name 'tech-blog-api'"
echo "# pm2 startup && pm2 save"
