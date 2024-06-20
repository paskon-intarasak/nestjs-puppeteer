#!/bin/bash

# Loop through numbers 1 to 10
for i in {1..10}
do
  # Calculate port number
  port=$((3000 + i))
  
  # Generate deep secret one
  deep_secret_one="deepone${i}"
  
  # Deep secret two remains the same
  deep_secret_two="deeptwo${i}"

  # Create the directory if it doesn't exist
  mkdir -p "env-example/example${i}"

  # Write the environment variables to the .env file
  cat <<EOL > "env-example/example${i}/.env"
NODE_ENV=production
APP_NAME=example${i}
APP_PORT=${port}
APP_DEEP_SECRET_ONE=${deep_secret_one}
APP_DEEP_SECRET_TWO=${deep_secret_two}
EOL
done

echo "Environment files created successfully."
