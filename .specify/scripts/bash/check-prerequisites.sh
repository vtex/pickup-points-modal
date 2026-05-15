#!/usr/bin/env bash
# check-prerequisites.sh
# Verifies that the SpecKit + Cowork setup in this repo is consistent.
# Exits non-zero and lists what is missing.

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
check "AGENTS.md exists"                       "[ -f \"$root/AGENTS.md\" ]"
check "CLAUDE.md is a symlink to AGENTS.md"    "[ \"\$(readlink \"$root/CLAUDE.md\" 2>/dev/null)\" = \"AGENTS.md\" ]"
check ".agents/skills/ exists"                 "[ -d \"$root/.agents/skills\" ]"
check ".agents/commands/ exists"               "[ -d \"$root/.agents/commands\" ]"
check ".agents/rules/ exists"                  "[ -d \"$root/.agents/rules\" ]"

printf "\nSDD Lite:\n"
check "skill 'specification' present"          "[ -f \"$root/.agents/skills/specification/SKILL.md\" ]"
check "skill 'implementing' present"           "[ -f \"$root/.agents/skills/implementing/SKILL.md\" ]"

printf "\nSDD Full:\n"
check "constitution.md present"                "[ -f \"$root/.specify/memory/constitution.md\" ]"
check "templates (>=5)"                        "[ \$(ls $root/.specify/templates/*-template.md 2>/dev/null | wc -l) -ge 5 ]"
check "scripts/bash (>=5)"                     "[ \$(ls $root/.specify/scripts/bash/*.sh 2>/dev/null | wc -l) -ge 5 ]"

printf "\nGitignore:\n"
check "/specs ignored"                         "grep -q '^/specs$' \"$root/.gitignore\""
check ".specify/feature.json ignored"          "grep -qE '^\\.specify/feature\\.json$' \"$root/.gitignore\""

if [ "$errors" -gt 0 ]; then
  printf "\n%d check(s) failed\n" "$errors"
  exit 1
fi

printf "\nall checks passed ✓\n"
