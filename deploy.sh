#!/bin/bash

# Tech Blog Frontend Deployment Script for EC2

echo "🚀 Starting deployment process..."

# Function to detect or get EC2 IP
get_ec2_ip() {
    if [ ! -z "$1" ]; then
        echo "$1"
    elif [ ! -z "$EC2_PUBLIC_IP" ]; then
        echo "$EC2_PUBLIC_IP"
    else
        echo "❌ Error: No EC2 IP provided"
        echo "Usage: ./deploy.sh [EC2_IP]"
        echo "Or set environment variable: export EC2_PUBLIC_IP=your.ip.address"
        exit 1
    fi
}

EC2_IP=$(get_ec2_ip "$1")

echo "📝 Using EC2 IP: $EC2_IP"

# Create production environment file (don't modify the template)
echo "📝 Creating production environment configuration..."
cat > .env.production.local << EOF
REACT_APP_API_URL=http://$EC2_IP:4005
REACT_APP_ENV=production
EOF

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building production bundle..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build files are in the 'build' directory"
echo ""
echo "📤 Uploading build files to EC2..."
if [ ! -z "$EC2_IP" ]; then
    echo "Copying build files to EC2..."
    scp -r build/* ubuntu@$EC2_IP:/var/www/tech-blog-frontend/ 2>/dev/null || {
        echo "⚠️  Direct upload failed. Please run manually:"
        echo "scp -i your-key.pem -r build/* ubuntu@$EC2_IP:/var/www/tech-blog-frontend/"
    }
fi
echo ""
echo "🌐 Your app will be accessible at: http://$EC2_IP"
