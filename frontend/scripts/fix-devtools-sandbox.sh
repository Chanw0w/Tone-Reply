#!/bin/sh
# Make the React Native DevTools launch cleanly in Docker (running as root).
# The DevTools is launched via `fb-dotslash <dotslash-file>`, which downloads and runs
# a Chromium/Electron binary. Chromium refuses its sandbox as root, so we:
# 1. Ensure the original dotslash file is in place (undo any wrapper that broke fb-dotslash).
# 2. Patch getShellBinaryAndArgs to pass --no-sandbox as an extra arg (fb-dotslash forwards
#    extra args to the binary).
# 3. Restore prepareDebuggerShellFromDotSlashFile (undo any skip-fetch patch) — the
#    fb-dotslash fetch works once the dotslash file is restored.
# Non-fatal: the app works either way; this just removes the log noise.

BIN=node_modules/@react-native/debugger-shell/bin/react-native-devtools
if [ -f "$BIN.real" ]; then
  mv "$BIN.real" "$BIN"
fi

INDEX=node_modules/@react-native/debugger-shell/dist/node/index.js
if ! grep -q 'DEVTOOLS_BINARY_DOTSLASH_FILE, "--no-sandbox"' "$INDEX" 2>/dev/null; then
  sed -i 's/\[prebuiltBinaryPath ?? DEVTOOLS_BINARY_DOTSLASH_FILE\],/[prebuiltBinaryPath ?? DEVTOOLS_BINARY_DOTSLASH_FILE, "--no-sandbox"],/' "$INDEX"
fi

LAUNCH=node_modules/@react-native/debugger-shell/dist/node/private/LaunchUtils.js
if grep -q 'prepareDebuggerShellFromDotSlashFile(filePath) { return' "$LAUNCH" 2>/dev/null; then
  sed -i 's/async function prepareDebuggerShellFromDotSlashFile(filePath) { return { code: "success" };/async function prepareDebuggerShellFromDotSlashFile(filePath) {/' "$LAUNCH"
fi
