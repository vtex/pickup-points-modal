#!/usr/bin/env bash
# update-agent-context.sh
# Imprime no stdout um resumo do contexto para colar em um prompt de agente.
# Lê AGENTS.md, constitution.md e a feature ativa (se houver).

set -euo pipefail
. "$(dirname "$0")/common.sh"

root="$(repo_root)"

printf "# Agent context (auto-generated)\n\n"
printf "## Repo\n"
printf "- %s (branch: %s)\n" "$(basename "$root")" "$(git rev-parse --abbrev-ref HEAD)"
printf "- last commit: %s\n\n" "$(git log -1 --pretty=%h\ %s)"

if [ -f "$root/AGENTS.md" ]; then
  printf "## AGENTS.md headers\n"
  grep -E '^## ' "$root/AGENTS.md" | sed 's/^## /- /'
  printf "\n"
fi

if [ -f "$root/.specify/memory/constitution.md" ]; then
  printf "## Constitution principles\n"
  grep -E '^### ' "$root/.specify/memory/constitution.md" | sed 's/^### /- /'
  printf "\n"
fi

feature_file="$root/.specify/feature.json"
if [ -f "$feature_file" ]; then
  slug=$(sed -n 's/.*"slug":"\([^"]*\)".*/\1/p' "$feature_file")
  printf "## Active feature\n"
  printf "- slug: %s\n" "$slug"
  [ -f "$root/specs/$slug/spec.md" ]  && printf "- spec.md: present\n"
  [ -f "$root/specs/$slug/plan.md" ]  && printf "- plan.md: present\n"
  [ -f "$root/specs/$slug/tasks.md" ] && printf "- tasks.md: present\n"
fi
