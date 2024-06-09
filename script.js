let input = document.querySelector(".buttons");
let firstNumber = '';
let secondNumber = '';
let operator = '';
let enteringNumber = false;

input.addEventListener('click', function(event) {
    let screen = document.querySelector(".numberDisplay");
    let fullOperationScreen = document.querySelector(".operationDisplay");
    let clearButton = document.querySelector(".clear");

    if (event.target.classList.contains("digit")) {
        if (firstNumber && operator && !enteringNumber) {
            screen.textContent = '';
            secondNumber = '';
            enteringNumber = true;
        } else if (firstNumber && !operator) {
            screen.textContent = '';
            fullOperationScreen.textContent = '';
            firstNumber = '';
        }
        screen.textContent += event.target.getAttribute('data-value');
        fullOperationScreen.textContent += event.target.getAttribute('data-value');
    }

    let content = screen.textContent;
    if (event.target.classList.contains("operator") && content) {
        if (firstNumber && operator) {
            secondNumber = screen.textContent;
            firstNumber = operate(firstNumber, operator, secondNumber);
            screen.textContent = '';
            secondNumber = '';
        } else if (firstNumber && !operator) {
            screen.textContent = '';
        } else {
            firstNumber = screen.textContent;
            screen.textContent = '';
        }
        operator = event.target.getAttribute('data-value');
        fullOperationScreen.textContent = firstNumber + operator;
        enteringSecondNumber = false;
    }
    
    if (event.target.classList.contains("equal") && content) {
        if (firstNumber && operator) {
            secondNumber = screen.textContent;
            firstNumber = operate(firstNumber, operator, secondNumber);
            screen.textContent = firstNumber;
            fullOperationScreen.textContent += '=' + firstNumber;
            secondNumber = '';
            operator = '';
        }
    }

    if (event.target.classList.contains("clearAll")) {
        screen.textContent = '';
        fullOperationScreen.textContent = '';
        firstNumber = '';
        secondNumber = '';
        operator = '';
    }

    if (event.target.classList.contains("clear") && content) {
        if (firstNumber && !operator) {
            return;
        }
        screen.textContent = screen.textContent.slice(0, -1);
        fullOperationScreen.textContent = fullOperationScreen.textContent.slice(0, -1);
    }

});

function operate(firstNumber, operator, secondNumber) {
    firstNumber = parseFloat(firstNumber);
    secondNumber = parseFloat(secondNumber);

    switch(operator) {
        case '+' :
            return firstNumber + secondNumber;
        case '-' :
            return firstNumber - secondNumber;
        case '*' :
            return firstNumber * secondNumber;
        case '/' : 
            return firstNumber / secondNumber;
        case '**' :
            return Math.pow(firstNumber, secondNumber);
    }
}