Remarkable:
If you not familiar with github action and helm combo you can do it with your local machine

- define your name space
- setup helm
- run helm install

# NestJS + Puppeteer + k8s + helm combo

## k8s

```
https://kubernetes.io/docs/home/
```

##### Get all secret

```
kubectl get secret --all-namespaces --field-selector type=Opaque
```

##### Get All Services Runing

```
kubectl get pods
```

##### Create New Secret

```
kubectl create secret generic nameofthesecret --from-literal=key=value --from-literal=key=value
```

###### example:

```
kubectl create secret generic example1 --from-literal=dank1=meme1 --from-literal=dank2=meme2
```

##### Get Deployment

```
kubectl get deployments -o wide
```

## HELM CHART

```
https://helm.sh/docs/
```

##### Apply Change (Deployment Change not Image\*\*\*\*)

```
helm upgrade {{your app name}} path/to/yourhelm
```

###### example:

```
helm upgrade nestjs-puppeteer ./k8s/nestjs-puppeteer
```

##### Apply Change (Deployment Change with Image Changes\*\*\*\*)

###### example:

```
helm upgrade nestjs-puppeteer k8s/nestjs-puppeteer -f k8s/nestjs-puppeteer/values.yaml
```

```
kubectl create secret generic cloudflare-origin-ca --from-file=ca.crt=path/to/ca.crt --from-file=cert.pem=path/to/cert.pem --from-file=key.pem=path/to/key.pem
```
