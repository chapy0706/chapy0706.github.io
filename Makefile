# ./Makefile
# Purpose: developer-friendly entrypoints for local + CI quality gates.
# Notes:
# - Make is just an entrypoint; real work lives in ./scripts/.
# - Targets are safe defaults; they do not modify source files.

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

PNPM ?= pnpm

.PHONY: help install typecheck build verify dev preview clean ci evidence evidence-verify

help:
	@echo "Targets:"
	@echo "  make install         - Install dependencies (local)"
	@echo "  make dev             - Start dev server"
	@echo "  make preview         - Preview production build"
	@echo "  make typecheck       - Run astro/type checks"
	@echo "  make build           - Build (dist/)"
	@echo "  make verify          - typecheck + build (quality gate)"
	@echo "  make ci              - CI gate (frozen install + verify)"
	@echo "  make evidence        - Run CI gate and save log to out/evidence/"
	@echo "  make evidence-verify - Run verify and save log to out/evidence/"
	@echo "  make clean           - Remove build artifacts (.astro/, dist/)"

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

evidence:
	@./scripts/evidence.sh ci

evidence-verify:
	@./scripts/evidence.sh verify

clean:
	@rm -rf dist .astro
