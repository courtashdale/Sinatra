# .sinatra-frontend
#!/bin/bash
echo "🧼 Formatting frontend with Prettier..."
npx prettier "**/*.{js,jsx,ts,tsx,json,css,md}" --write

echo "🐍 Formatting backend with Black..."
cd ../backend && black .

echo "✅ Formatting complete!"