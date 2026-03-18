# CI/CD DevOps Project (AWS + Kubernetes + Jenkins)

A production-style DevOps pipeline implementing CI/CD, infrastructure automation, containerization, and monitoring across multiple virtual machines.

---

## Project Overview

This project demonstrates a **complete DevOps lifecycle**:

- Infrastructure provisioning on AWS
- Configuration management using Ansible
- CI/CD pipeline using Jenkins
- Containerization with Docker
- Kubernetes-based deployment
- Monitoring using Prometheus & Grafana

---

## Architecture

```
User → Load Balancer (Optional) → VM3 (K8s Worker / Deployment)
                                  ↑
VM2 → CI Server (Jenkins + Docker + K8s Master)
                                  ↑
VM1 → Monitoring + Config (Prometheus + Grafana + Ansible)
```

---

## Tech Stack

- **Cloud:** AWS EC2 (us-east-1 recommended)
- **Configuration Management:** Ansible
- **CI/CD:** Jenkins
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Monitoring:** Prometheus + Grafana
- **Version Control:** GitHub

---

## Project Structure

```
.
├── k8s/              # Kubernetes manifests (deployment, service)
├── public/           # Static assets
├── views/            # Frontend templates
├── server.js         # Node.js application
├── Dockerfile        # Container build config
├── package.json      # Dependencies
├── package-lock.json
├── .dockerignore
├── .gitignore
```

---

## Infrastructure Setup

### VM Configuration

| VM  | Role                        | Tools Installed                                  |
|-----|-----------------------------|--------------------------------------------------|
| VM1 | Monitoring + Config Server  | Ansible, Prometheus, Grafana                     |
| VM2 | CI/CD + Master Node         | Jenkins, Docker, Git, Kubernetes Master          |
| VM3 | Deployment Node             | Kubernetes Worker, Node Exporter                 |

---

## Setup Steps

### 1. Create EC2 Instances

- Launch 3 VMs (Ubuntu / Amazon Linux)
- Open required ports:
  - `22` (SSH)
  - `8080` (Jenkins)
  - `3000` (Grafana)
  - `9100` (Node Exporter)
  - App port (e.g., 80 / 3000)

---

### 2. Configure VM1 (Ansible + Monitoring)

```bash
ssh -i key.pem ec2-user@vm1-ip
```

Create inventory:

```
[vm2]
vm2-ip ansible_user=ec2-user ansible_ssh_private_key_file=key.pem

[vm3]
vm3-ip ansible_user=ec2-user ansible_ssh_private_key_file=key.pem
```

Install Ansible:

```bash
sudo yum update -y
sudo yum install ansible -y
```

---

### 3. Configure VM2 (CI Server)

Using Ansible:

```bash
ansible-playbook -i host vm2.yml
```

Installs:

- Docker
- Jenkins
- Git
- Kubernetes Master
- Node Exporter

Access Jenkins:

```
http://<vm2-ip>:8080
```

---

### 4. Configure VM3 (Worker Node)

```bash
ansible-playbook -i host vm3.yml
```

Installs:

- Kubernetes Worker
- Container Runtime
- Node Exporter

---

## CI/CD Pipeline (Jenkins)

Pipeline stages:

```
Code → Build → Test → Docker Build → Push → Deploy (K8s)
```

### Docker Build

```bash
docker build -t <dockerhub-username>/app:latest .
```

### Push Image

```bash
docker push <dockerhub-username>/app:latest
```

---

## Kubernetes Deployment

K8s configs are inside:

```
k8s/
```

Apply deployment:

```bash
kubectl apply -f k8s/
```

---

## Monitoring Setup

### Prometheus Targets

```
<vm2-ip>:9100
<vm3-ip>:9100
```

---

### Grafana

Access:

```
http://<vm1-ip>:3000
```

Steps:

1. Add Prometheus data source  
2. Import Node Exporter dashboard  

---

## Testing

```bash
curl http://<vm3-ip>:<app-port>
```

Or open in browser:

```
http://<vm3-ip>:<app-port>
```

---

## Security Notes

- Use IAM roles instead of hardcoded credentials  
- Store secrets in Jenkins credentials manager  
- Restrict security group access  
- Enable HTTPS (via Load Balancer or Ingress)  

---

## Future Improvements

- Add auto-scaling (HPA in Kubernetes)
- Implement Blue-Green / Canary deployments
- Add Helm charts
- Integrate security scanning (Trivy / Snyk)
- Use Terraform for full infra automation

---

## Author

AadhieSec  
GitHub: https://github.com/Aadhiesec1

---
