
// SpendWise - Personal Finance Tracker

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

let transactions = JSON.parse(
    localStorage.getItem("spendwise-transactions") || "[]"
);

// Format Kenyan Shillings
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES"
    }).format(amount);
}

// Display current date
document.getElementById("current-date").textContent =
    new Date().toLocaleDateString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Save transactions
function saveTransactions() {
    localStorage.setItem(
        "spendwise-transactions",
        JSON.stringify(transactions)
    );
}

// Update dashboard totals
function updateDashboard() {
    const income = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const expenses = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const balance = income - expenses;

    document.getElementById("balance").textContent =
        formatCurrency(balance);

    document.getElementById("income").textContent =
        formatCurrency(income);

    document.getElementById("expenses").textContent =
        formatCurrency(expenses);
}

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions yet. Add your first transaction!
            </p>
        `;
        updateDashboard();
        return;
    }

    transactions.forEach(transaction => {
        const item = document.createElement("div");
        item.className = "transaction-item";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("h3");
        title.textContent = transaction.description;

        const details = document.createElement("p");
        details.textContent =
            `${transaction.category} • ${transaction.date}`;

        info.append(title, details);

        const right = document.createElement("div");
        right.className = "transaction-right";

        const amount = document.createElement("p");
        amount.className = transaction.type === "income"
            ? "transaction-amount positive"
            : "transaction-amount negative";

        amount.textContent =
            `${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        right.append(amount, deleteButton);
        item.append(info, right);

        transactionList.appendChild(item);
    });

    updateDashboard();
}

// Add new transaction
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description =
        document.getElementById("description").value.trim();

    const amount = Number(
        document.getElementById("amount").value
    );

    const category =
        document.getElementById("category").value;

    const type =
        document.getElementById("type").value;

    if (!description || !Number.isFinite(amount) || amount <= 0 || !category) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        description: description,
        amount: amount,
        category: category,
        type: type,
        date: new Date().toLocaleDateString("en-KE")
    };

    transactions.unshift(transaction);

    saveTransactions();
    displayTransactions();

    form.reset();
});

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    displayTransactions();
}

// Load saved transactions
displayTransactions();
