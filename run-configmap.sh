#!/bin/bash
for ((i = 1; i <= 10; i++)); do
    filename="example${i}-configmap.yaml"
    kubectl apply -f "env-example/example${i}/${filename}"
done
