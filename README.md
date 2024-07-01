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

---

## Step 2: Install kubectl

kubectl is a command line tool for controlling Kubernetes clusters. You can install kubectl via Docker Desktop or CLI.

### Install kubectl via Docker Desktop

1. Open Docker Desktop.
2. Go to **Settings** -> **Kubernetes**.
3. Check the box for **Enable Kubernetes**.
4. Apply and restart Docker Desktop.

---

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

---

## Step 4: Edit Configuration Environment YAML Files

Before we going to run this project we need to edit/config configmap.yaml file first let's take a look!

Edit the configuration environment YAML files found in the `env-example` folder. Rename the files as needed. For example, rename to `example1-configmap.yaml`.

#### Example of `example1-configmap.yaml`

```yaml
apiVersion: v1
data:
  APP_NAME: example1
  APP_PORT: '3001'
  APP_WEB_URL: https://www.google.com
  NODE_ENV: production
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: example1
```

<!--  -->

#### apiVersion

```yaml
apiVersion: v1
```

- **apiVersion:** Specifies the version of the Kubernetes API to use. Here, `v1` is used, which is the stable version for core Kubernetes objects.

#### kind

```yaml
kind: ConfigMap
```

- **kind:** Indicates the type of Kubernetes object. In this case, it's a `ConfigMap`, which is used to store non-confidential configuration data in key-value pairs.

#### metadata

```yaml
metadata:
  creationTimestamp: null
  name: example1
```

- **metadata:** Contains metadata about the `ConfigMap`.
  - **creationTimestamp:** This field is set to `null` in this snippet, but in a real Kubernetes object, it would contain the timestamp when the object was created.
  - **name:** The name of the `ConfigMap`, which is `example1`. This name is used to reference the `ConfigMap` in other Kubernetes resources.

#### data

```yaml
data:
  APP_NAME: example1
  APP_PORT: '3001'
  APP_WEB_URL: https://www.google.com
  NODE_ENV: production
```

- **data:** A section where the actual configuration data is stored in key-value pairs.
  - **APP_NAME:** A custom configuration setting, likely the name of the application, set to `example1`.
  - **APP_PORT:** Another custom setting indicating the port the application will use, set to `3001`. It's stored as a string.
  - **APP_WEB_URL:** A URL associated with the application, set to `https://www.google.com`.
  - **NODE_ENV:** Specifies the environment in which the application is running, set to `production`. This is commonly used in Node.js applications to distinguish between development and production environments.

### Example Usage

This `ConfigMap` can be referenced in a pod definition to inject these configuration values into the pod's environment variables. Here is an example of how you might reference this `ConfigMap` in a pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
    - name: example-container
      image: example-image
      envFrom:
        - configMapRef:
            name: example1
```

In this pod definition:

- **envFrom:** The `configMapRef` specifies that the environment variables should be populated from the `ConfigMap` named `example1`.
- **example1:** The name of the `ConfigMap` being referenced.

When this pod runs, it will have environment variables `APP_NAME`, `APP_PORT`, `APP_WEB_URL`, and `NODE_ENV` set with the values from the `ConfigMap`.

---

## Step 5: Apply Configuration Map using Bash Script

you can do it one by one as you like but the odds requirement is deploy in one click so here the bash script

After editing the configuration and naming the environment YAML files, apply the config maps using the following bash script in `run-configmap.sh`.

you can run by using this command

```sh
kubectl apply -f "your-config-map-file.yml"
```

The command `kubectl apply -f "your-config-map-file.yml"` is used with `kubectl`, which is a command-line tool for Kubernetes. Here's a breakdown of what each part does:

- `kubectl`: This is the command-line interface for running commands against Kubernetes clusters.
- `apply`: This subcommand is used to create or update resources defined in configuration files.
- `-f "your-config-map-file.yml"`: This specifies the path to the YAML file (`your-config-map-file.yml`) that contains the configuration you want to apply to your Kubernetes cluster.

So, when you run `kubectl apply -f "your-config-map-file.yml"`, Kubernetes reads the YAML file specified (`your-config-map-file.yml`), interprets its contents, and either creates new resources or updates existing ones in your Kubernetes cluster based on the definitions in the file. This is often used for deploying applications, creating configuration maps (`ConfigMap`), defining services, or managing other resources within Kubernetes.

or you can run

```sh
sh ./run-configmap.sh
```

in `run-configmap.sh`

```sh
#!/bin/bash
for ((i = 1; i <= 10; i++)); do
    filename="example${i}-configmap.yaml"
    kubectl apply -f "env-example/example${i}/${filename}"
done
```

This bash script is designed to apply a series of Kubernetes ConfigMap YAML files to a cluster using `kubectl`. Let's break down what each part of the script does:

```bash
#!/bin/bash
```

- This line specifies that the script should be interpreted by the Bash shell.

```bash
for ((i = 1; i <= 10; i++)); do
```

- This line starts a `for` loop that iterates from `i = 1` to `i = 10`, incrementing `i` by 1 each time (`i++`).

```bash
    filename="example${i}-configmap.yaml"
```

- Inside the loop, it constructs a filename using the current value of `i`. For example, if `i` is 1, the filename would be `"example1-configmap.yaml"`.

```bash
    kubectl apply -f "env-example/example${i}/${filename}"
```

- This line uses `kubectl apply` to apply a Kubernetes resource specified in the YAML file `"env-example/example${i}/${filename}"`.
- `${filename}` is substituted with the current filename constructed in the loop (`example${i}-configmap.yaml`).

```bash
done
```

- This ends the `for` loop.

If you have specific YAML files structured as `example1-configmap.yaml`, `example2-configmap.yaml`, etc., this script would apply them sequentially to your Kubernetes environment.

Run the script:

```sh
sh run-configmap.sh
```

---

After you finish edit and apply configmap into k8s let's take a loot at `deploymeny.yml` file

#### Example of `deploymeny.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: example1
  name: example1
  namespace: example1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example1
  template:
    metadata:
      labels:
        app: example1
    spec:
      containers:
        - image: '{{ .Values.image.repository }}:{{ .Values.image.tag }}'
          name: nestjs-puppetter-example-1
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: example1
                  key: NODE_ENV

            - name: APP_NAME
              valueFrom:
                configMapKeyRef:
                  name: example1
                  key: APP_NAME

            - name: APP_PORT
              valueFrom:
                configMapKeyRef:
                  name: example1
                  key: APP_PORT

            - name: APP_WEB_URL
              valueFrom:
                configMapKeyRef:
                  name: example1
                  key: APP_WEB_URL
```

#### Explain:

#### `API Version`

```yaml
apiVersion: apps/v1
```

- Specifies the API version used to create the Deployment object. In this case, `apps/v1` is used.

#### `Kind`

```yaml
kind: Deployment
```

- Indicates that this configuration file is for creating a Deployment object.

#### `Metadata`

```yaml
metadata:
  labels:
    app: example1
  name: example1
  namespace: example1
```

- **labels**: Key-value pairs to categorize the Deployment.
  - `app: example1`: Labels this Deployment with the key `app` and value `example1`.
- **name**: The name of the Deployment, set to `example1`.
- **namespace**: The namespace in which this Deployment will be created, set to `example1`.

#### `Spec`

```yaml
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example1
```

- **replicas**: The number of pod replicas to run, set to `1`.
- **selector**: Defines how to find the Pods created by this Deployment.
  - **matchLabels**: Pods must have the label `app: example1` to be selected by this Deployment.

### `Template`

```yaml
template:
  metadata:
    labels:
      app: example1
  spec:
    containers:
      - image: '{{ .Values.image.repository }}:{{ .Values.image.tag }}'
        name: nestjs-puppetter-example-1
        ports:
          - containerPort: 3001
```

- **template**: Describes the Pods that will be created.
  - **metadata**: Labels for the Pods.
    - `app: example1`: Each Pod will be labeled with `app: example1`.
  - **spec**: Specification for the Pod.
    - **containers**: List of containers within the Pod.
      - **image**: The container image to run, defined by Helm values `{{ .Values.image.repository }}:{{ .Values.image.tag }}`.
      - **name**: The name of the container, set to `nestjs-puppetter-example-1`.
      - **ports**: List of ports to expose from the container.
        - **containerPort**: The port to expose, set to `3001`.

#### Environment Variables

```yaml
env:
  - name: NODE_ENV
    valueFrom:
      configMapKeyRef:
        name: example1
        key: NODE_ENV

  - name: APP_NAME
    valueFrom:
      configMapKeyRef:
        name: example1
        key: APP_NAME

  - name: APP_PORT
    valueFrom:
      configMapKeyRef:
        name: example1
        key: APP_PORT

  - name: APP_WEB_URL
    valueFrom:
      configMapKeyRef:
        name: example1
        key: APP_WEB_URL
```

- **`env`**: Environment variables for the container.
  - **`NODE_ENV`**:
    - **`valueFrom`**: Sources the value from a ConfigMap.
      - **`configMapKeyRef`**: References the ConfigMap named `example1` and uses the key `NODE_ENV`.
  - **`APP_NAME`**:
    - **`valueFrom`**: Sources the value from a ConfigMap.
      - **`configMapKeyRef`**: References the ConfigMap named `example1` and uses the key `APP_NAME`.
  - **`APP_PORT`**:
    - **`valueFrom`**: Sources the value from a ConfigMap.
      - **`configMapKeyRef`**: References the ConfigMap named `example1` and uses the key `APP_PORT`.
  - **`APP_WEB_URL`**:
    - **`valueFrom`**: Sources the value from a ConfigMap.
      - **`configMapKeyRef`**: References the ConfigMap named `example1` and uses the key `APP_WEB_URL`.

---

#### example of `service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example1
  namespace: example1
spec:
  selector:
    app: example1
  ports:
    - protocol: TCP
      port: 3001
  type: LoadBalancer
```

### `apiVersion` and `kind`

- `apiVersion: v1`: Specifies the Kubernetes API version being used, in this case, version 1.
- `kind: Service`: Defines that this YAML describes a Kubernetes Service object, which enables networking to a set of Pods in Kubernetes.

### `metadata`

- `metadata`: Contains metadata about the Service.
  - `name: example1`: Specifies the name of the Service as `example1`.
  - `namespace: example1`: Specifies the namespace where this Service resides. Namespaces in Kubernetes provide a way to divide cluster resources between multiple users or teams.

### `spec`

- `spec`: Describes the desired state of the Service.
  - `selector`: Specifies how the Service selects Pods to load balance traffic to.
    - `app: example1`: Matches Pods that have the label `app: example1`. This selector ensures that this Service will route traffic to Pods that are labeled with `app: example1`.
  - `ports`: Specifies the ports that the Service exposes.
    - `- protocol: TCP`: Defines the protocol used for the port (TCP in this case).
    - `port: 3001`: Specifies the port number on the Service. Incoming traffic to this port on the Service will be forwarded to the Pods that match the selector.
  - `type: LoadBalancer`: Specifies the type of Service. A `LoadBalancer` type Service provisions an external load balancer (like a cloud provider's load balancer) that will route external traffic to the Service's Pods. This is particularly useful for exposing a Service to external traffic from outside the Kubernetes cluster.

---

after you config everything include `deployment.yaml` amd `service.yaml` And then run this command to apply or upgrade current deployment in this case is nestjs-puppeteer

```sh
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/
```

The `helm upgrade --install` command is used to upgrade a Helm release if it already exists, or install it if it does not. Here's a breakdown of the command you provided:

### Command Breakdown

- `helm upgrade --install`: This part of the command tells Helm to either upgrade an existing release or install it if it does not already exist.

- `nestjs-puppeteer`: This is the name of the Helm release. A release is a specific deployment of a Helm chart with a given configuration.

- `k8s/nestjs-puppeteer/`: This specifies the path to the Helm chart. The chart defines the Kubernetes resources and configurations needed to deploy an application. In this case, it seems to be a chart for deploying a NestJS application that uses Puppeteer.

### What This Command Does

1. **Check for Existing Release**:
   - Helm checks if there is an existing release named `nestjs-puppeteer`.
2. **Upgrade or Install**:
   - If the release exists, Helm upgrades it to the version specified in the `k8s/nestjs-puppeteer/` chart.
   - If the release does not exist, Helm installs it using the `k8s/nestjs-puppeteer/` chart.

### Example Scenario

Suppose you have a Helm chart for a NestJS application that integrates Puppeteer for server-side rendering or automated browser tasks. The chart is stored in the `k8s/nestjs-puppeteer/` directory. You want to deploy this application to your Kubernetes cluster. You run the command:

```sh
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/
```

- If this is the first time deploying the application, Helm installs it.
- If the application is already deployed, Helm upgrades the existing deployment with any changes made to the chart or its values.

### Additional Options

You can also pass additional options to customize the deployment:

- `--values` or `-f`: Specify a YAML file with custom values.
- `--set`: Override specific values in the chart from the command line.

Example with custom values:

```sh
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/ -f custom-values.yaml
```

This command would use the `custom-values.yaml` file to override default values in the Helm chart.

also you can run bash script in the example

```sh
sh ./install-upgrade-helm.sh
```

---

if you release new version of your image

#### example

```yaml
image:
  repository: marutora7876/nestjs-puppeteer
  # Dynamic Tag
  tag: prototype -> change this to anything you like for example tag:latest
  pullPolicy: Always
```

and the apply this to

```sh
helm upgrade --install nestjs-puppeteer k8s/nestjs-puppeteer/ -f values.yaml
```

## Optional (Ingress and Resource Limit)

#### ingress

```yaml
ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
  hosts:
    - host: example1.example.com
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: example1
              port:
                number: 3001
    - host: example2.example.com
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: example2
              port:
                number: 3002
  tls:
    - secretName: cloudflare-origin-ca
      hosts:
        - service1.example.com
    - secretName: service2-tls
      hosts:
        - service2.example.com
```

This YAML snippet defines Kubernetes resources for managing Ingress configuration and services. Let's break down each section:

#### Explanation:

- **Ingress**: Enables Kubernetes Ingress resource for routing external HTTP/S traffic into the Kubernetes cluster.
- **Annotations**: Specifies custom configurations for the Nginx Ingress controller. In this case, `nginx.ingress.kubernetes.io/rewrite-target: /` is used to rewrite the URL path when forwarding traffic to backend services.
- **Hosts**: Defines the hostnames (`example1.example.com`, `example2.example.com`) for which traffic should be routed.

  - **Paths**: Specifies the URL paths (`/`) that match these hosts. `pathType: Prefix` indicates that requests matching this path prefix will be routed.
  - **Backend Services**: Defines the backend services (`example1`, `example2`) to which traffic should be forwarded, each specifying the service name (`name: example1`, `name: example2`) and port (`port: number: 3001`, `port: number: 3002`).

- **TLS**: Configures TLS termination for secure HTTPS connections.
  - `secretName`: Specifies the Kubernetes Secret containing TLS certificates for each hostname.
  - `hosts`: Lists the hostnames (`service1.example.com`, `service2.example.com`) that should be secured with TLS.

### Service Configuration

```yaml
example1:
  replicaCount: 1
  containerPort: 3001
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 64Mi
```

#### Explanation:

- **example1**: Defines a Kubernetes Deployment or StatefulSet named `example1`.
  - **replicaCount**: Specifies the number of replica pods (`replicaCount: 1` indicates a single pod for this service).
  - **containerPort**: Defines the port (`3001`) on which the container in this deployment listens.
  - **resources**: Specifies resource requests and limits for the pod.
    - **limits**: Maximum amount of CPU and memory the container can use (`cpu: 100m`, `memory: 128Mi`).
    - **requests**: Minimum amount of CPU and memory required by the container (`cpu: 50m`, `memory: 64Mi`).
