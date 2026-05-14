#!/usr/bin/env bash
# check-prerequisites.sh
# Verifica que o setup do SpecKit + Cowork está consistente neste repo.
# Sai com !=0 e lista o que falta.

set -euo pipefail
. "$(dirname "$0")/common.sh"

root="$(repo_root)"
errors=0

check() {
  local description="$1"
  local condition="$2"
  if eval "$condition" >/dev/null 2>&1; then
    printf "  ✓ %s\n" "$description"
  else
    printf "  ✗ %s\n" "$description"
    errors=$((errors + 1))
  fi
}

printf "AI artifacts:\n"
check "AGENTS.md existe"                    "[ -f \"$root/AGENTS.md\" ]"
check "CLAUDE.md é symlink para AGENTS.md"  "[ \"\$(readlink \"$root/CLAUDE.md\" 2>/dev/null)\" = \"AGENTS.md\" ]"
check ".agents/skills/ existe"              "[ -d \"$root/.agents/skills\" ]"
check ".agents/commands/ existe"            "[ -d \"$root/.agents/commands\" ]"
check ".agents/rules/ existe"               "[ -d \"$root/.agents/rules\" ]"

printf "\nSDD Lite:\n"
check "skill 'specification' presente"      "[ -f \"$root/.agents/skills/specification/SKILL.md\" ]"
check "skill 'implementing' presente"       "[ -f \"$root/.agents/skills/implementing/SKILL.md\" ]"

printf "\nSDD Full:\n"
check "constitution.md presente"            "[ -f \"$root/.specify/memory/constitution.md\" ]"
check "templates (5)"                       "[ \$(ls $root/.specify/templates/*-template.md 2>/dev/null | wc -l) -ge 5 ]"
check "scripts/bash (>=5)"                  "[ \$(ls $root/.specify/scripts/bash/*.sh 2>/dev/null | wc -l) -ge 5 ]"

printf "\nGitignore:\n"
check "/specs ignorado"                     "grep -q '^/specs$' \"$root/.gitignore\""
check ".specify/feature.json ignorado"      "grep -qE '^\\.specify/feature\\.json$' \"$root/.gitignore\""

if [ "$errors" -gt 0 ]; then
  printf "\n%d check(s) falharam\n" "$errors"
  exit 1
fi

printf "\ntudo ok ✓\n"
