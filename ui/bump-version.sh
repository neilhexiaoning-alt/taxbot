#!/bin/bash
# Auto-bump Taxbot version, build, and sync to taxbot-setup
# Usage: bash ui/bump-version.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION_FILE="$SCRIPT_DIR/taxchat/version.ts"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Read current version (compatible with Windows grep)
CURRENT=$(sed -n 's/.*TAXBOT_VERSION = "\([^"]*\)".*/\1/p' "$VERSION_FILE")
TODAY=$(date +%Y%m%d)

# Parse date and build number
CUR_DATE="${CURRENT%%.*}"
CUR_NUM="${CURRENT##*.}"

# Bump: same day → increment N, new day → 1
if [ "$CUR_DATE" = "$TODAY" ]; then
  NEW_NUM=$((CUR_NUM + 1))
else
  NEW_NUM=1
fi
NEW_VERSION="${TODAY}.${NEW_NUM}"

# Write new version
cat > "$VERSION_FILE" << EOF
/**
 * Taxbot Version
 * Format: YYYYMMDD.N (date.build_number)
 * Auto-bumped by bump-version.sh
 */
export const TAXBOT_VERSION = "${NEW_VERSION}";
EOF

echo "Version: ${CURRENT} -> ${NEW_VERSION}"

# Build
cd "$SCRIPT_DIR"
pnpm exec vite build

# Sync to taxbot-setup
cp -r "$ROOT_DIR/dist/control-ui/"* "$ROOT_DIR/taxbot-setup/dist/control-ui/"

echo "Done! Taxbot ${NEW_VERSION} synced to taxbot-setup."
