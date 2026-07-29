# Career OS — Developer Command Interface
#
# All commands run inside the Docker development container.
# Prerequisites: Docker 24+ and Docker Compose v2.
#
# Quick start:
#   make install   → Install all dependencies
#   make dev       → Start the development server at http://localhost:3000
#   make help      → List all available commands

.DEFAULT_GOAL := help
DOCKER_COMPOSE := docker compose -f infra/docker-compose.yml
EXEC := $(DOCKER_COMPOSE) exec dev
RUN  := $(DOCKER_COMPOSE) run --rm dev

# ── Development ──────────────────────────────────────────────────────────────

.PHONY: dev
dev: ## Start the full development environment (website + all packages)
	$(DOCKER_COMPOSE) up dev

.PHONY: shell
shell: ## Open an interactive shell inside the dev container
	$(RUN) sh

.PHONY: install
install: ## Install all workspace dependencies (runs inside container)
	$(RUN) pnpm install

# ── Code Quality ─────────────────────────────────────────────────────────────

.PHONY: build
build: ## Build all packages and apps via Turborepo
	$(RUN) pnpm build

.PHONY: type-check
type-check: ## Run TypeScript type checking across all workspaces
	$(RUN) pnpm type-check

.PHONY: lint
lint: ## Run ESLint across all workspaces
	$(RUN) pnpm lint

.PHONY: format
format: ## Format all files with Prettier
	$(RUN) pnpm format

.PHONY: test
test: ## Run all test suites via Turborepo
	$(RUN) pnpm test

# ── Content Pipeline ─────────────────────────────────────────────────────────

.PHONY: validate content\:validate
validate: ## Validate all content in content/raw/ against Zod schemas
	$(RUN) pnpm content:validate

content\:validate: ## Alias for validate target
	$(RUN) pnpm content:validate

.PHONY: generate
generate: ## Run the full generation pipeline (resume, github, website)
	$(RUN) pnpm generate

# ── Infrastructure ────────────────────────────────────────────────────────────

.PHONY: up
up: ## Start all Docker services in the background
	$(DOCKER_COMPOSE) up -d

.PHONY: down
down: ## Stop all Docker services
	$(DOCKER_COMPOSE) down

.PHONY: logs
logs: ## Tail the dev container logs
	$(DOCKER_COMPOSE) logs -f dev

.PHONY: rebuild
rebuild: ## Rebuild the Docker image from scratch (use after Dockerfile changes)
	$(DOCKER_COMPOSE) build --no-cache dev

# ── Cleanup ───────────────────────────────────────────────────────────────────

.PHONY: clean
clean: ## Remove containers, named volumes, and all generated output
	$(DOCKER_COMPOSE) down -v
	rm -rf output/json output/resume output/github-profile output/website output/recruiter-package
	find . -name ".next" -type d -not -path "./.git/*" -prune -exec rm -rf {} + 2>/dev/null || true
	find . -name "dist"  -type d -not -path "./.git/*" -prune -exec rm -rf {} + 2>/dev/null || true
	find . -name ".turbo" -type d -not -path "./.git/*" -prune -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Cleaned generated output and Docker volumes"

.PHONY: clean-deps
clean-deps: ## Remove all node_modules (re-run make install afterwards)
	find . -name "node_modules" -type d -not -path "./.git/*" -prune -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Removed node_modules — run 'make install' to reinstall"

# ── Help ──────────────────────────────────────────────────────────────────────

.PHONY: help
help: ## Display this help message
	@echo ""
	@echo "  Career OS — Development Commands"
	@echo "  All commands run inside the Docker container."
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
