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
echo "🔧 Next steps for EC2 deployment:"
echo "1. Copy the 'build' folder to your EC2 instance"
echo "2. Install and configure Nginx or Apache"
echo "3. Make sure your backend API is running on port 4005"
echo "4. Configure your security groups to allow traffic on ports 80, 443, and 4005"
echo ""
echo "📋 Example commands to copy to EC2:"
echo "scp -r build/ ubuntu@$EC2_IP:~/tech-blog-frontend/"
echo ""
echo "🌐 Your app will be accessible at: http://$EC2_IP"
