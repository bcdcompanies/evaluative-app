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

## GitHub Learning Exercise

This repository is also used as an exercise to learn more about GitHub. Below are some key GitHub concepts:

### Key GitHub Concepts

- **Repository**: A place where your project lives, containing all files and revision history.
- **Branch**: A parallel version of a repository used to develop features without affecting the main codebase.
- **Commit**: A saved change to a file or set of files with a descriptive message.
- **Pull Request (PR)**: A request to merge changes from one branch into another, enabling code review.
- **Issue**: A way to track ideas, enhancements, tasks, or bugs in a repository.
- **Fork**: A personal copy of another user's repository that lives on your account.
- **Clone**: A local copy of a remote repository on your machine.
- **Merge**: Combining changes from one branch into another.
- **GitHub Actions**: Automated workflows for CI/CD triggered by repository events.

### Basic Git Workflow

1. Clone the repository: `git clone <repo-url>`
2. Create a branch: `git checkout -b feature/my-feature`
3. Make changes and stage them: `git add .`
4. Commit changes: `git commit -m "Add my feature"`
5. Push the branch: `git push origin feature/my-feature`
6. Open a Pull Request on GitHub to merge your changes
