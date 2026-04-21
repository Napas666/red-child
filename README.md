# RED CHILD — Cybersecurity Learning App

> Structured cybersecurity curriculum in a neon-noir desktop environment.
> Built for those who want to move from zero to job-ready in security research.

---

## Overview

Red Child is an offline-first desktop application for learning cybersecurity — built with Electron, React, and TypeScript. No accounts, no subscriptions, no internet required after installation. Everything runs and saves locally.

The course follows the structure of real-world security researcher career paths: starting from threat fundamentals, progressing through web exploitation and vulnerability research, into network security, malware analysis, and binary reverse engineering. Each module combines theory sections with practical code examples and a quiz with explanations.

Designed to be used as a preparation track for a position in security research — Kaspersky GReAT, ESET, or any offensive/defensive security team.

---

## Course Modules

| # | Module | Topics |
|---|--------|--------|
| 1 | **Threat Fundamentals** | Kill Chain, MITRE ATT&CK, CVE/CVSS, CIA triad, Linux basics, cryptography (AES/RSA/TLS) |
| 2 | **Web Security** | OWASP Top 10, XSS, SQLi, IDOR, SSRF, HTTP headers, JWT/OAuth attacks, CSRF |
| 3 | **Vulnerability Research** | Black/Grey/White box, STRIDE, fuzzing, PoC development, Bug Bounty, LFI/XXE/SSTI, Burp Suite, Metasploit |
| 4 | **Network Security** | OSI/TCP-IP, Nmap, Wireshark, ARP spoofing, MITM, DNS poisoning, iptables, Snort/Suricata |
| 5 | **Malware Analysis** | PE format, static/dynamic analysis, YARA rules, sandboxes, IoC extraction, Pyramid of Pain |
| 6 | **Reverse Engineering** | x86/x64 assembly, Ghidra/IDA, GDB/x64dbg, anti-debug techniques, CTF, buffer overflow, ROP chains |

Each module includes:
- Theory sections with tables, code examples, and practical commands
- Hover tooltips for every technical term (XSS, IDOR, APT, ROP, etc.)
- Quiz with explanations for each answer
- XP reward system with levels and streaks

---

## Compatibility

| Platform | Status |
|----------|--------|
| macOS (Apple Silicon M1/M2/M3) | Supported |
| macOS (Intel x86_64) | Supported |
| Windows 10/11 x64 | Supported |
| Linux | Runs from source |

macOS users: the app runs as a standard Electron application. No admin privileges required. No system modifications. All data is stored in your local app storage via localStorage — nothing is sent anywhere.

To run on macOS from source:

```bash
git clone https://github.com/Napas666/red-child.git
cd red-child
npm install
npm run dev
```

---

## Tech Stack

- **Electron 28** — desktop shell, frameless window with custom title bar
- **React 18 + TypeScript** — UI
- **Zustand** — state management with localStorage persistence
- **Framer Motion** — animations
- **electron-vite** — build toolchain

No backend. No telemetry. No external dependencies at runtime.

---

## Screenshots

> Neon red / cyberpunk aesthetic. Orbitron for headers, JetBrains Mono for code, Rajdhani for body text.

---

## Local Development

```bash
npm install
npm run dev      # development (hot reload)
npm run build    # production build
```

Requires Node.js 18+ and npm.

---

## Motivation

Built as a focused preparation tool for a security researcher career path — covering the same material you'd encounter in real CTF challenges, bug bounty programs, and GReAT-level malware research. The interactive format (XP, streaks, per-section completion) keeps the material engaging across 6 modules and ~40 theory sections.

---

## License

MIT
