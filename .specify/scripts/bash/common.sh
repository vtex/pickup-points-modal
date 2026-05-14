#!/usr/bin/env bash
# common.sh — shared helpers for SpecKit scripts.
# Source from sibling scripts:  . "$(dirname "$0")/common.sh"

set -euo pipefail

# Absolute path to the repo root (works even if the script is invoked
# from a different CWD).
repo_root() {
  git rev-parse --show-toplevel
}

# Directory where local-only specs live (git-ignored).
specs_dir() {
  printf "%s/specs" "$(repo_root)"
}

# SpecKit state directory.
specify_dir() {
  printf "%s/.specify" "$(repo_root)"
}

# Slugify a title: "Add awesome feature!" -> "add-awesome-feature".
slugify() {
  printf "%s" "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

# Print to stderr and exit non-zero.
die() {
  printf "error: %s\n" "$*" >&2
  exit 1
}

# Fail loudly if the working tree has pending changes.
require_clean_tree() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    die "working tree is not clean — commit or stash before running"
  fi
}

# Assert that a file exists; abort otherwise.
require_file() {
  [ -f "$1" ] || die "required file missing: $1"
}
