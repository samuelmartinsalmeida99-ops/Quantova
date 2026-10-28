# 📊 Quantova

**Quantova** is a lightweight personal finance web application designed to help users track their income, expenses, and monthly spending.

It provides a clear overview of financial activity through an intuitive dashboard, interactive charts, and a transaction history.

<p align="center">
  <a href="https://samuelmartinsalmeida99-ops.github.io/Quantova/">
    <strong>🚀 Live Demo</strong>
  </a>
</p>

## ✨ Features

* **Financial Dashboard** — View monthly expenses, income, balance, and spending categories in one place.
* **Income and Expense Tracking** — Record financial transactions with categories, dates, descriptions, and amounts.
* **Interactive Charts** — Visualize expense distribution by category using doughnut charts.
* **Transaction History** — Browse previous transactions, filter by category, and delete individual records.
* **Monthly Overview** — Navigate between months to review financial activity.
* **Category Breakdown** — Compare spending and income across different categories.
* **Currency Settings** — Choose between EUR, USD, GBP, and BRL as the displayed currency symbol.
* **Progressive Web App (PWA)** — Includes a web app manifest, application icons, and a service worker for caching application resources.

## 🛠️ Tech Stack

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| HTML5             | Application structure                   |
| CSS3              | Styling and responsive layouts          |
| JavaScript (ES6+) | Application logic and interactivity     |
| Chart.js          | Financial data visualization            |
| IndexedDB         | Local storage of financial transactions |
| Local Storage     | Persistence of user preferences         |
| Service Workers   | Caching application resources           |

## 🏗️ How It Works

Quantova runs directly in the browser without requiring a dedicated backend server or database service.

Financial transactions are stored in the browser using **IndexedDB**, while the selected currency symbol is saved in Local Storage.

This makes the application simple to deploy and use without creating an account.

**Data storage note:** Transactions are stored locally in the browser. They are not automatically synchronized between devices or backed up to a cloud service.

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
