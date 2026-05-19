# Bun Issue Draft

## Summary

Running Playwright browser-launch code under Bun on Windows hangs at Chromium launch, while the same code succeeds under Node on the same machine.

This repro intentionally removes all app code and reduces the problem to:

- one direct `chromium.launch()` script
- one trivial Playwright test that opens a `data:` URL
- the same dependency set and browser build for both Bun and Node

## Environment

- OS: Windows
- Bun: `1.3.14`
- Node: `26.1.0`
- Playwright: `1.60.0`

## Install

```powershell
npm install
npm run install:browsers
```

## Reproduction

### Direct launch control

Node succeeds:

```powershell
node .\scripts\launch.mjs
```

Bun fails:

```powershell
bun .\scripts\launch.mjs
```

### Playwright test runner control

Node succeeds:

```powershell
node .\node_modules\playwright\cli.js test
```

Bun fails:

```powershell
bun .\node_modules\playwright\cli.js test
```

## Actual behavior

Under Bun, Playwright launches Chromium and then times out waiting for launch to complete.

Typical error shape:

```text
TimeoutError: launch: Timeout 15000ms exceeded.
Call log:
  - <launching> ...\chrome.exe ... --remote-debugging-pipe --no-startup-window
  - <launched> pid=...
```

The browser process starts, but the `--remote-debugging-pipe` handshake never completes.

## Expected behavior

The same Playwright launch should succeed under Bun, just as it does under Node.

## Why this looks Bun-specific

- The same exact script succeeds under Node on the same machine.
- The same exact Playwright test succeeds under Node on the same machine.
- No web app or dev server is involved.
- Existing Bun issues appear related:
  - `oven-sh/bun#15679`
  - `oven-sh/bun#9911`
- Playwright maintainers previously pointed a matching Windows timeout report back to Bun:
  - `microsoft/playwright#31233`
