const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expensesDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// Armazenando transações no localStorage:
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactionsStorage = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactionsStorage = transactionsStorage
        .filter(transaction => transaction.id !== ID)
    /* O array receberá todos as transações 
       que já tem, exceto a que foi clicada(excluída) */
    
   updateLocalStorage()
   init()
}

const addTransactionDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const cssClass = transaction.amount < 0 ? 'minus' : 'plus'
    const absoluteValueOparator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(cssClass)
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${absoluteValueOparator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `
    transactionUl.append(li)
}

// Criando um array somente com os valores das transações
const updateBalanceValues = () => {
    const transactionsAmounts = transactionsStorage
        .map(transaction => transaction.amount)
    const total = transactionsAmounts
        .reduce((acumulador, atual) => acumulador + atual, 0)
        .toFixed(2)
    const income = transactionsAmounts
        .filter(value => value > 0)
        .reduce((acumulador, atual) => acumulador + atual, 0)
        .toFixed(2)
    const expenses = Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((acumulador, atual) => acumulador + atual, 0))
        .toFixed(2)
    
    // Exibindo os valores na DOM
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expensesDisplay.textContent = `R$ ${expenses}`
}

// A função abaixo vai inserir as transações quando a página for carregada
const init = () => {
    transactionUl.innerHTML = ''
    transactionsStorage.forEach(addTransactionDOM)
    updateBalanceValues()
}

init()

//Armazenando as transações no LocalStorage:
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactionsStorage))
}

// Gerando IDs aleatórios(de 1 a 1000):
const generateID = () => Math.round(Math.random() * 1000)

const addTransactionArray = (transactionName, transactionAmount) => {
    const transaction = { 
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount) 
    }
    transactionsStorage.push(transaction)
    // A constante 'transactionAmount' retorna uma string.
    // Para transformar em number, deve-se envolver na função construtora 'Number()'
}

cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const formSubmitEvent = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const inputEmpty = transactionName === '' || transactionAmount === ''

    if(inputEmpty){
        alert('Preencha o nome e o valor da transação!')
        return
    }

    addTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()

}

form.addEventListener('submit', formSubmitEvent)