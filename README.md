<!-- Step by Step Guide -->

# Setup Guide

This guide will walk you through installing Docker, kubectl, and Helm on your system.

## Step 1: Install Docker or Docker Desktop

### Docker Installation

Follow the official Docker installation guide for your operating system:

- [Docker for Windows](https://docs.docker.com/desktop/windows/install/)
- [Docker for Mac](https://docs.docker.com/desktop/mac/install/)
- [Docker for Linux](https://docs.docker.com/engine/install/)

### Docker Desktop Installation

Docker Desktop is an easy-to-install application for your Mac or Windows environment that enables you to build and share containerized applications and microservices.

- [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

After installing Docker or Docker Desktop, verify the installation by running the following command in your terminal:

```sh
docker --version
```

## Step 2: Install kubectl

kubectl is a command line tool for controlling Kubernetes clusters. You can install kubectl via Docker Desktop or CLI.

### Install kubectl via Docker Desktop

1. Open Docker Desktop.
2. Go to **Settings** -> **Kubernetes**.
3. Check the box for **Enable Kubernetes**.
4. Apply and restart Docker Desktop.

### Install kubectl via CLI

Follow the official guide to install kubectl on your operating system:

- [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

Verify the installation by running:

```sh
kubectl version --client
```

## Step 3: Install Helm

Helm is a package manager for Kubernetes. Follow the steps below to install Helm.

### Install Helm on macOS using Homebrew

```sh
brew install helm
```

### Install Helm on Windows using Chocolatey

```sh
choco install kubernetes-helm
```

### Install Helm on Linux using script

```sh
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation by running:

```sh
helm version
```

## Step 4: Edit Configuration Environment YAML Files

Edit the configuration environment YAML files found in the `env-example` folder. Rename the files as needed. For example, rename to `example1-configmap.yaml`.

## Step 5: Apply Configuration Map using Bash Script

After editing the configuration and naming the environment YAML files, apply the config maps using the following bash script in `run-configmap.sh`.

Create a file named `run-configmap.sh` and add the following script:

```sh
#!/bin/bash
for ((i = 1; i <= 10; i++)); do
    filename="example${i}-configmap.yaml"
    kubectl apply -f "env-example/example${i}/${filename}"
done
```

Run the script:

```sh
sh run-configmap.sh
```

And then run this command to apply or upgrade current deployment in this case is nestjs-puppeteer

```sh
#!/bin/bash
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/
echo "Done Install and Upgrade Helm Chart"

```

you can config namespace in service.yaml

```yaml
# deployment.yaml
metadata:
  name: example2
  namespace: example2
```

and deployment.yml

```yaml
# service.yaml
metadata:
  name: example7
  namespace: example7
```

if you have any change or new image to deploy just config everything and then upgrade

```sh
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/
```
