# 📊 Quantova

**Quantova** is a lightweight personal finance web application designed to help users track their income, expenses, and monthly spending.

It provides a clear monthly overview, spending by category, and tools to manage and back up transactions.

<p align="center">
  <a href="https://samuelmartinsalmeida99-ops.github.io/Quantova/">
    <strong>🚀 Live Demo</strong>
  </a>
</p>

## ✨ Features

* **Financial Dashboard** — View monthly expenses, income, balance, and spending categories in one place.
* **Income and Expense Tracking** — Record financial transactions with categories, dates, descriptions, and amounts.
* **Spending by Category** — Review the monthly distribution of expenses and identify the main spending category.
* **Transaction History** — Search transactions, filter by type, category, and date range, and edit or delete records.
* **Monthly Overview** — Use month arrows or the month picker to review financial activity.
* **Category Breakdown** — Compare spending and income across different categories.
* **Currency Settings** — Choose between EUR, USD, GBP, and BRL as the displayed currency symbol.
* **Data Backups** — Export transactions as CSV, create a JSON backup, and restore from a Quantova JSON backup.
* **Progressive Web App (PWA)** — Includes a web app manifest, application icons, and a service worker for caching application resources.

## 🛠️ Tech Stack

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| HTML5             | Application structure                   |
| CSS3              | Styling and responsive layouts          |
| JavaScript (ES6+) | Application logic and interactivity     |
| CSS and JavaScript | Category chart and financial summaries  |
| IndexedDB         | Local storage of financial transactions |
| Local Storage     | Persistence of user preferences         |
| Service Workers   | Caching application resources           |

## 🏗️ How It Works

Quantova runs directly in the browser without requiring a dedicated backend server or database service.

Financial transactions are stored in the browser using **IndexedDB**, while the selected currency is saved in Local Storage.

This makes the application simple to deploy and use without creating an account.

**Data storage note:** Transactions are stored locally in the browser and are not synchronized between devices. Export a CSV or JSON backup to keep a separate copy. Importing a JSON backup replaces the transactions currently stored in the browser.

## 🚀 Getting Started

### Prerequisites

* A modern web browser.
* Python or another local HTTP server.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/samuelmartinsalmeida99-ops/Quantova.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Quantova
   ```

3. Start a local HTTP server:

   ```bash
   python -m http.server 8000
   ```

4. Open the following address in your browser:

   ```text
   http://localhost:8000
   ```

No build process or package installation is required.

## 📁 Project Structure

```text
Quantova/
├── index.html
├── add.html
├── historico.html
├── style.css
├── app.js
├── add.js
├── historico.js
├── db-local.js
├── settings.js
├── manifest.json
├── sw.js
└── README.md
```

### Main Files

* `index.html` — Main dashboard.
* `add.html` — Transaction creation interface.
* `historico.html` — Transaction history.
* `app.js` — Dashboard calculations and chart rendering.
* `add.js` — Transaction form handling.
* `historico.js` — History rendering and category filtering.
* `db-local.js` — IndexedDB operations.
* `settings.js` — Currency preferences and data management.
* `sw.js` — Service worker and resource caching.
* `manifest.json` — Progressive Web App configuration.

## 🎯 Project Goals

Quantova was developed as a practical project to explore modern browser technologies and create a simple, accessible personal finance management experience.

The project focuses on:

* Building interactive interfaces with vanilla JavaScript.
* Managing structured data with IndexedDB.
* Visualizing financial information with charts.
* Implementing browser storage and Progressive Web App features.

## 👨‍💻 Author

**Samuel Almeida**

[GitHub Profile](https://github.com/samuelmartinsalmeida99-ops)
