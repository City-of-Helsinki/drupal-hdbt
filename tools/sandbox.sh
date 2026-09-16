#!/bin/sh
#
# Runs a command inside a Node container.
#
# NPM scripts in package.json are executed with this wrapper so that
# third party code is never executed directly on the developer's user
# account.
#
# Usage: tools/sandbox.sh <command> [args...]

set -eu

# Already inside a container: run the command as-is.
if [ -f /.dockerenv ] || [ -f /run/.containerenv ]; then
  exec "$@"
fi

if [ "$#" -eq 0 ]; then
  echo "$0: no command given" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "$0: docker was not found in \$PATH" >&2
  exit 127
fi

HDBT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
THEMES_DIR=$(CDPATH='' cd -- "$HDBT_DIR/../.." && pwd)
THEME_DIR=$(pwd)

case "$THEME_DIR" in
  "$THEMES_DIR"/*) ;;
  *)
    echo "$0: must be run from a theme directory under $THEMES_DIR" >&2
    exit 1
    ;;
esac

# Mirror the host layout under /app/public/themes.
THEMES_WORKDIR=/app/public/themes
WORKDIR="$THEMES_WORKDIR/${THEME_DIR#"$THEMES_DIR"/}"
HDBT_WORKDIR="$THEMES_WORKDIR/${HDBT_DIR#"$THEMES_DIR"/}"

IMAGE=node:24-alpine

# Keep watch mode and test runners interactive when there is a terminal.
TTY_FLAG=''
if [ -t 0 ] && [ -t 1 ]; then
  TTY_FLAG='-t'
fi

# A subtheme needs hdbt as well, read-only.
HDBT_VOLUME=''
if [ "$THEME_DIR" != "$HDBT_DIR" ]; then
  HDBT_VOLUME="--volume=$HDBT_DIR:$HDBT_WORKDIR:ro"
fi

# npm adds node_modules/.bin to $PATH. `docker run` starts the
# command directly, so the bin directories have to be declared.
SANDBOX_PATH="$WORKDIR/node_modules/.bin:$HDBT_WORKDIR/node_modules/.bin:$HDBT_WORKDIR/theme-builder/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

exec docker run \
  --rm \
  --init \
  --interactive \
  $TTY_FLAG \
  --user "$(id -u):$(id -g)" \
  --network none \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --read-only \
  --tmpfs /tmp:rw,mode=1777,size=1g \
  --tmpfs /sandbox-home:rw,uid=$(id -u),gid=$(id -g),size=256m \
  --volume "$THEME_DIR:$WORKDIR" \
  $HDBT_VOLUME \
  --workdir "$WORKDIR" \
  --env HOME=/sandbox-home \
  --env PATH="$SANDBOX_PATH" \
  --env npm_config_cache=/sandbox-home/npm \
  --env CI \
  "$IMAGE" \
  "$@"
