# Bun Playwright Launch Timeout Repro

This repository isolates a Windows issue where Playwright browser launch succeeds under Node and fails under Bun.

It intentionally contains no web app, no dev server, and no application code. The only moving parts are:

- one direct `chromium.launch()` script
- one trivial Playwright test that opens a `data:` URL
- the same Playwright and Chromium build exercised under both runtimes

## Runtime versions

This repro was verified with:

- Bun `1.3.14`
- Node `26.1.0`
- Playwright `1.60.0`

The runtime pins are stored in:

- `.bun-version`
- `.node-version`

## Setup

```powershell
npm install
npm run install:browsers
```

## Shortest repro

The shortest failing command is:

```powershell
bun .\scripts\launch.mjs
```

The control command that succeeds on the same machine is:

```powershell
node .\scripts\launch.mjs
```

Both commands execute the same file.

## Reproduce

### Direct launch control

Node control:

```powershell
node .\scripts\launch.mjs
```

Bun repro:

```powershell
bun .\scripts\launch.mjs
```

### Playwright test runner control

Node control:

```powershell
node .\node_modules\playwright\cli.js test
```

Bun repro:

```powershell
bun .\node_modules\playwright\cli.js test
```

You can also use the package scripts:

```powershell
npm run probe:node
npm run probe:bun
npm run test:node
npm run test:bun
```

The default launch timeout is `15000ms` so the repro finishes quickly. Override it if needed:

```powershell
$env:PW_LAUNCH_TIMEOUT = '180000'
bun .\scripts\launch.mjs
```

## Expected outcome

On the affected Windows host:

- `node .\scripts\launch.mjs` succeeds.
- `bun .\scripts\launch.mjs` fails with `TimeoutError: launch: Timeout 15000ms exceeded.`
- `node .\node_modules\playwright\cli.js test` succeeds.
- `bun .\node_modules\playwright\cli.js test` fails with the same launch shape.

The failure shape is:

- Chromium is launched.
- Playwright reports the browser process id.
- the `--remote-debugging-pipe` handshake never completes.
- Playwright times out waiting for launch to finish.

## Test conditions

- Same machine.
- Same Playwright version.
- Same browser build.
- Same script and same test.
- No app code.
- No network dependency beyond Playwright browser install.

This isolates the runtime boundary as the primary variable.

## Relevant upstream issues

- `oven-sh/bun#15679`: `playwright cannot run chromium.launch()`
- `oven-sh/bun#9911`: `Playwright connectOverCDP() not working`
- `microsoft/playwright#31233`: Windows timeout launching Chromium with Bun
