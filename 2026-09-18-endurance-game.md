# Endurance Career Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a complete playable offline endurance career decision game.
**Architecture:** Data module, deterministic simulation/state module, DOM presentation module; concatenate into a single HTML for delivery. All gameplay state serialises as JSON.
**Tech Stack:** Vanilla HTML/CSS/JavaScript, Node built-in test runner, Python Playwright for browser verification.
**Spec:** docs/superpowers/specs/2026-09-18-endurance-design.md

## Global Constraints
German UI. No remote runtime assets or paid services. Persist and validate state. Distinct driver/manager authority. Fictional gameplay numbers. Never claim a live URL without a successful public deployment.

### Task 1: career and simulation
Files: src/data.js, src/engine.js, tests/engine.test.cjs.
Interface: Endurance.createCareer(options), prepare(state,action), startRace(state), choices(state), choose(state,id), pit(state,options), standings(state), offers(state), acceptOffer(state,id), nextRound(state), validate(state), serialise(state), parse(text).
- [x] Write tests using `node:test` and `node:assert/strict` for all public APIs, race shared state, independent crews, duration, results, promotion and invalid data.
- [x] Run `node --test tests/engine.test.cjs`; confirm missing implementation assertions fail.
- [x] Implement deterministic seeded simulation with five-minute ticks and automatic legal crew rotations.
- [x] Run tests and stress full seasons across five classes and both modes.

### Task 2: complete browser UI
Files: src/app.js, src/style.css, src/shell.html, build.cjs, tests/browser_test.py.
Interface: browser global Endurance consumes the engine API; localStorage keys endurance-v1-slot-1/2/3; use text escaping for all user text.
- [x] Add browser tests expecting title, career form, preparation, race actions, navigation, standings, saves and mobile layout; confirm missing page fails.
- [x] Implement start screen, garage, race control, team, calendar, market, archive and settings with delegated events and accessible controls.
- [x] Bundle scripts/styles inline with `node build.cjs`.
- [x] Run desktop and mobile browser tests and inspect screenshots.

### Task 3: release
Files: README.txt, manifest.webmanifest, sw.js, static deployment index.html, source and tests.
- [x] Run `node --test tests/engine.test.cjs` and `python tests/browser_test.py`.
- [x] Check ZIP file contents and injected-HTML boot. Record that managed Chromium blocks file:// navigation; real-device installation is unverified.
- [x] Deliver actual HTML and ZIP links; identify unconnected public hosting separately.
