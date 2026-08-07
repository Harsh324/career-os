.PHONY: help up up-backend up-frontend down restart logs build migrate seed lint format test clean

COMPOSE_FULL = infra/docker-compose.yml
COMPOSE_BACKEND = infra/docker-compose.backend.yml
COMPOSE_FRONTEND = infra/docker-compose.frontend.yml

DOCKER_COMPOSE = docker compose

help:
	@echo "Career OS v2 Modular Infrastructure Commands:"
	@echo "  make up          - Start full stack (db + backend + frontend)"
	@echo "  make up-backend  - Start isolated backend stack (db + Django REST API)"
	@echo "  make up-frontend - Start isolated frontend stack (Next.js UI)"
	@echo "  make down        - Stop all containers"
	@echo "  make restart     - Restart all containers"
	@echo "  make logs        - View full stack logs"
	@echo "  make build       - Rebuild all Docker images"
	@echo "  make migrate     - Run Django database migrations inside container"
	@echo "  make seed        - Seed initial database data inside container"
	@echo "  make lint        - Run Ruff and ESLint checkers"
	@echo "  make format      - Run Ruff formatter"
	@echo "  make test        - Run unit tests"

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) up -d

up-backend:
	$(DOCKER_COMPOSE) -f $(COMPOSE_BACKEND) up -d

up-frontend:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FRONTEND) up -d

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) down

restart:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) restart

logs:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) logs -f

build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) build

migrate:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run python manage.py makemigrations
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run python manage.py migrate

seed:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run python manage.py seed_initial_data

lint:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run ruff check .
	cd frontend && npm run lint

format:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run ruff format .

test:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) exec backend uv run python manage.py test
	cd frontend && npm run type-check

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FULL) down -v
