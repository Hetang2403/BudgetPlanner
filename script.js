// script.js

document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budget-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const dateInput = document.getElementById('date');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');
    const budgetChartEl = document.getElementById('budgetChart');
    const goalsForm = document.getElementById('goals-form');
    const goalDescriptionInput = document.getElementById('goal-description');
    const goalAmountInput = document.getElementById('goal-amount');
    const goalDeadlineInput = document.getElementById('goal-deadline');
    const goalsContainer = document.getElementById('goals');
    let budgetData = [];
    let savingGoals = [];

    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;
        const date = dateInput.value;

        if (description && amount && type && date) {
            addBudgetItem(description, amount, type, date);
            descriptionInput.value = '';
            amountInput.value = '';
            dateInput.value = '';
            updateSummary();
            updateChart();
        }
    });

    goalsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const description = goalDescriptionInput.value;
        const amount = parseFloat(goalAmountInput.value);
        const deadline = goalDeadlineInput.value;

        if (description && amount && deadline) {
            addSavingGoal(description, amount, deadline);
            goalDescriptionInput.value = '';
            goalAmountInput.value = '';
            goalDeadlineInput.value = '';
            displaySavingGoals();
        }
    });

    function addBudgetItem(description, amount, type, date) {
        const budgetItem = {
            description,
            amount,
            type,
            date: new Date(date)
        };
        budgetData.push(budgetItem);
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
    }

    function addSavingGoal(description, amount, deadline) {
        const goal = {
            description,
            amount,
            deadline: new Date(deadline)
        };
        savingGoals.push(goal);
        localStorage.setItem('savingGoals', JSON.stringify(savingGoals));
    }

    function updateSummary() {
        let totalIncome = 0;
        let totalExpense = 0;

        budgetData.forEach(item => {
            if (item.type === 'income') {
                totalIncome += item.amount;
            } else {
                totalExpense += item.amount;
            }
        });

        totalIncomeEl.textContent = totalIncome.toFixed(2);
        totalExpenseEl.textContent = totalExpense.toFixed(2);
        balanceEl.textContent = (totalIncome - totalExpense).toFixed(2);
    }

    function updateChart() {
        const labels = budgetData.map(item => item.date.toLocaleDateString());
        const incomeData = budgetData.map(item => item.type === 'income' ? item.amount : 0);
        const expenseData = budgetData.map(item => item.type === 'expense' ? item.amount : 0);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: incomeData,
                    fill: false,
                },
                {
                    label: 'Expense',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: expenseData,
                    fill: false,
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        };

        new Chart(budgetChartEl, config);
    }

    function displaySavingGoals() {
        goalsContainer.innerHTML = '';
        savingGoals.forEach(goal => {
            const goalEl = document.createElement('div');
            goalEl.className = 'goal';
            goalEl.innerHTML = `${goal.description} - $${goal.amount} - ${goal.deadline.toLocaleDateString()}`;
            goalsContainer.appendChild(goalEl);
        });
    }

    function loadBudgetData() {
        const storedData = localStorage.getItem('budgetData');
        if (storedData) {
            budgetData = JSON.parse(storedData);
            updateSummary();
            updateChart();
        }
    }

    function loadSavingGoals() {
        const storedGoals = localStorage.getItem('savingGoals');
        if (storedGoals) {
            savingGoals = JSON.parse(storedGoals);
            displaySavingGoals();
        }
    }

    loadBudgetData();
    loadSavingGoals();
});
