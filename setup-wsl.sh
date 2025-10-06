#!/bin/bash

set -e

echo "🔧 Updating package list..."
sudo apt update

echo "📦 Installing dependencies: curl, git..."
sudo apt install -y curl git

echo "📥 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🔁 Enabling corepack and setting up pnpm..."
sudo corepack enable
corepack prepare pnpm@latest --activate

echo "✅ Setup complete. Run 'pnpm --version' to verify."
