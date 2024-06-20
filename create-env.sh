#!/bin/bash
websites=(
  "https://www.google.com"
  "https://github.com"
  "https://www.wikipedia.org"
  "https://www.youtube.com"
  "https://www.amazon.com"
  "https://twitter.com"
  "https://www.reddit.com"
  "https://stackoverflow.com"
  "https://medium.com"
  "https://www.linkedin.com"
)

for i in {1..10}; do
  port=$((3000 + i))
  mkdir -p "env-example/example${i}"
  website_url=${websites[$((i - 1))]}
  cat <<EOL >"env-example/example${i}/.env"
NODE_ENV=production
APP_NAME=example${i}
APP_PORT=${port}
APP_WEB_URL=${website_url}
EOL
done

echo "Environment files created successfully."
