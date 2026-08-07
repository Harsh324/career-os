# Stage 1: Build & Dependencies Layer
FROM ghcr.io/astral-sh/uv:latest AS uv_bin
FROM python:3.12-slim AS base

# Python environment configuration
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_SYSTEM_PYTHON=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy uv binary from official image
COPY --from=uv_bin /uv /uvx /bin/

# Create a non-privileged user for container security
RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/bash -m appuser

# Copy python dependency manifest and readme
COPY backend/pyproject.toml backend/README.md backend/uv.lock* /app/

# Install python dependencies without requiring project editable install yet
RUN uv sync --no-install-project || true

# Copy application source code
COPY backend/ /app/

# Install full project with dependencies
RUN uv sync

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Healthcheck to ensure API responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/settings/ || exit 1

CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
