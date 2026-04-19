# Emulator Calculator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Tech](https://img.shields.io/badge/tech-React%20Native%20%7C%20Expo%20%7C%20TypeScript-blue)

**Emulator Calculator** is a professional-grade mobile application designed to handle complex mathematical expressions including Fractions, N-th Roots, and Derivatives. Built with React Native and Expo, it provides a seamless cross-platform experience.
![Showcase](./image.png)

## 🌟 Features

-   **Complex Expressions**: Support for LaTeX-based rendering of Fractions (`\frac{a}{b}`) and Roots (`\sqrt[n]{x}`).
-   **Advanced Calculus**: Derivative calculations (d/dx).
-   **Dynamic UI**: Auto-scrolling expression display and Dark/Light theme support.
-   **Cross-Platform**: Optimized for both iOS and Android.

## 🛠️ Tech Stack

-   **Framework**: [Expo](https://expo.dev) (React Native)
-   **Language**: TypeScript
-   **Math Engine**: [mathjs](https://mathjs.org)
-   **Rendering**: MathJax (HTML to SVG)

## 🚀 Getting Started

### Prerequisites
-   Node.js (LTS recommended)
-   npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Jeffreys38/emulator-calculator.git

# Navigate to the project directory
cd emulator-calculator

# Install dependencies
npm install
```

### Usage

```bash
# Start the development server
npx expo start
```

## 🌍 Languages

-   [Tiếng Việt](./README_VN.md) (Coming Soon)
-   [Français](./README_FR.md) (Coming Soon)

## 🧑‍💻 Developer's Note

This project serves as a foundational example of handling mathematical syntax trees (AST) and rendering LaTeX in a mobile environment. Students contributing to this repo should focus on:
1.  **Strict Typing**: Ensure all expressions implement the `IExpression` interface.
2.  **Logic Separation**: Keep UI components separate from calculation logic (in `modules/`).
3.  **Testing**: Verify edge cases for nested expressions (e.g., Fraction inside a Root).

## ✅ Production-Readiness Improvements

- Added typed calculator error codes (`INVALID_PARAMETER`, `INCOMPLETE_EXPRESSION`, `INVALID_EXPRESSION`, `EMPTY_EXPRESSION`) and standardized error logging for evaluation failures.
- Fixed derivative parameter parsing edge case for `x = 0` and improved empty-expression handling in evaluation flow.
- Added guardrails to prevent evaluating incomplete Fraction/Root expressions.
- Added focused Jest tests for new expression guard logic to prevent regressions.

---
*Maintained by [Jeffreys38](https://github.com/Jeffreys38)*
