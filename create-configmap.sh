#!/bin/bash

for i in {1..10}; do
  example_dir="example${i}"
  env_file="env-example/${example_dir}/.env"

  # Create ConfigMap and save to YAML file
  # kubectl create configmap ${example_dir} --from-file=${env_file} --dry-run=client -o yaml > ${output_file}
  kubectl create configmap ${example_dir} --from-env-file=${env_file} --dry-run=client -o yaml >env-example/${example_dir}/${example_dir}-configmap.yaml
  # kubectl create configmap ${example_dir} --from-env-file=${env_file} --dry-run=client

  echo "ConfigMap for ${example_dir} created and saved to env-example/${example_dir}/${example_dir}-configmap.yaml"
done

echo "All ConfigMaps created successfully."
