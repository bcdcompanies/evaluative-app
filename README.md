# Anesthesia Risk Evaluator

A web-based pre-operative anesthesia risk assessment tool built with React + TypeScript + Vite + Tailwind CSS.

## Features

- **Multi-step patient assessment form** — Demographics, Comorbidities, Airway, Vitals & Labs
- **ASA Physical Status Classification** — auto-suggested or manually selected (ASA I–VI)
- **Risk scoring engine** — combines ASA class, comorbidities, airway findings, and vitals
- **Risk output** — Low / Moderate / High / Very High with flagged concerns and clinical recommendations
- **Patient list** — local-storage backed, view/delete past evaluations
- **Printable report** — browser print-friendly summary

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest

## Disclaimer

This tool is a clinical decision-support aid only. It does not replace the judgment of a licensed anesthesiologist or medical professional.
