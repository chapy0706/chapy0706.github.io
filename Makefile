# ./Makefile
# Purpose: developer-friendly entrypoints for local + CI quality gates.
# Notes:
# - Make is just an entrypoint; real work lives in ./scripts/.
# - Targets are safe defaults; they do not modify source files.

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

PNPM ?= pnpm

.PHONY: help install typecheck build verify dev preview clean ci

help:
	@printf "%s\n" \
	"Targets:" \
	"  make install     - Install dependencies (local)" \
	"  make dev         - Start dev server" \
	"  make preview     - Preview production build" \
	"  make typecheck   - Run astro/type checks" \
	"  make build       - Build (dist/)" \
	"  make verify      - typecheck + build (quality gate)" \
	"  make ci          - CI gate (frozen install + verify)" \
	"  make clean       - Remove build artifacts (.astro/, dist/)"

install:
	@command -v corepack >/dev/null 2>&1 && corepack enable >/dev/null 2>&1 || true
	@$(PNPM) install

dev:
	@$(PNPM) run -s dev

preview:
	@$(PNPM) run -s preview

typecheck:
	@$(PNPM) run -s typecheck

build:
	@$(PNPM) run -s build

verify:
	@./scripts/verify.sh

ci:
	@./scripts/ci.sh

clean:
	@rm -rf dist .astro
