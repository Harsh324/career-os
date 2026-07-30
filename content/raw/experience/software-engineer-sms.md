---
title: Software Engineer
company: SMS DataTech
company_slug: sms-datatech
subtitle: Backend & Cloud Engineering
location: Tokyo, Japan (Remote / India Hub)
employment_type: full-time
start_date: "2023-07"
end_date: present
featured: true
resume_include: true
mission: Building AI-powered backend systems and cloud-native infrastructure for enterprise data platforms.
role_summary: Leading backend software engineering initiatives at SMS DataTech, designing high-concurrency REST API services, managing cloud infrastructure on AWS, and optimizing PostgreSQL database query performance for core platform services.
highlights:
  - "Built AI-powered scraping & transaction analysis platform"
  - "Redesigned backend microservices architecture"
  - "Architected containerized Docker & AWS ECS/Fargate primitives"
  - "Reduced p95 API query latency by over 40%"
core_stack:
  - Python
  - Django
  - AWS
  - Docker
focus_areas:
  - Backend Architecture
  - Cloud Infrastructure
  - Distributed Systems
  - AI-powered Automation
tech_groups:
  Backend:
    - Python
    - Django
    - REST APIs
    - Microservices
  Cloud & Data:
    - AWS
    - PostgreSQL
    - Redis
    - ORM Optimizations
  Infrastructure & DevOps:
    - Docker
    - Git Tooling
    - CI/CD Pipelines
challenges:
  - problem: High p95 API query latency caused by unindexed PostgreSQL joins under peak request concurrency.
    solution: Implemented Redis caching layers, query plan optimizations, and targeted database indexing strategies.
    impact: Reduced p95 latency by over 40% and improved database throughput under load.
  - problem: Monolithic service tight-coupling delaying developer feature releases and staging deployment pipelines.
    solution: Architected containerized microservices deployed via Docker and automated environment variable management.
    impact: Accelerated developer release cycles and established zero-downtime staging deployment workflows.
metrics:
  - label: p95 Query Latency
    value: "-40%"
  - label: Service Availability
    value: "99.9%"
  - label: Database Throughput
    value: "+60%"
team: Core Platform Engineering (5 Backend Engineers, 2 DevOps Engineers)
ownership: Full ownership of backend REST API contracts, database schema migrations, and AWS deployment automation.
lessons_learned:
  - "Decoupled microservice contracts enforce clear domain boundaries and eliminate cross-team deployment bottlenecks."
  - "Database index tuning and Redis caching yield higher p95 latency gains than premature service horizontal scaling."
related_projects:
  - fintrack-ai
  - career-os
technologies:
  - Python
  - Django
  - PostgreSQL
  - AWS
  - Docker
  - REST APIs
  - Microservices
  - Redis
slug: software-engineer-sms
---

### Executive Overview

As a full-time Software Engineer at SMS DataTech, I architect high-availability backend microservices, lead database performance tuning initiatives, and containerize production workloads on AWS. My work focuses on scalable API engineering, relational schema design, and developer tooling automation.
