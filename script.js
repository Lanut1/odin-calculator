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
        if (screen.textContent.slice(0, 1) === "0" && screen.textContent.length === 1) {
            screen.textContent = '';
            if (!operator) {
                fullOperationScreen.textContent = '';
            }

            if (operator) {
                fullOperationScreen.textContent = fullOperationScreen.textContent.slice(0, -1);
            }
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
            if (firstNumber.slice(-1) === ".") {
                firstNumber += "0";
            }
            screen.textContent = '';
        }

        if (firstNumber === "You cannot divide by zero!") {
            screen.textContent = firstNumber;
            fullOperationScreen.textContent = '';
            firstNumber = '';
            secondNumber = '';
            operator = '';
            disableAllButtonsExcept(".clearAll");
            return;
        }
        operator = event.target.getAttribute('data-value');
        fullOperationScreen.textContent = firstNumber + operator;
        enteringSecondNumber = false;
        document.querySelector(".decimal").disabled = false;
    }
    
    if (event.target.classList.contains("equal") && content) {
        if (firstNumber && operator) {
            secondNumber = screen.textContent;
            if (secondNumber.slice(-1) === ".") {
                fullOperationScreen.textContent += "0";
            }
            firstNumber = operate(firstNumber, operator, secondNumber);
            if (firstNumber === "You cannot divide by zero!") {
                screen.textContent = firstNumber;
                fullOperationScreen.textContent = '';
                firstNumber = '';
                secondNumber = '';
                operator = '';
                disableAllButtonsExcept(".clearAll");
                return;
            }
            screen.textContent = firstNumber;
            fullOperationScreen.textContent += '=' + firstNumber;
            secondNumber = '';
            operator = '';
            document.querySelector(".decimal").disabled = false;
        }
    }

    if (event.target.classList.contains("decimal")) {
        if (!content) {
            screen.textContent += "0.";
            fullOperationScreen.textContent += "0.";
            document.querySelector(".decimal").disabled = true;
        } else {
            screen.textContent += ".";
            fullOperationScreen.textContent += ".";
            document.querySelector(".decimal").disabled = true;
        }

        if (firstNumber && !operator) {
            screen.textContent = '';
            fullOperationScreen.textContent = '';
            firstNumber = '';
            screen.textContent += "0.";
            fullOperationScreen.textContent += "0.";
            document.querySelector(".decimal").disabled = true;
        }
    }

    if (event.target.classList.contains("sign-change") && content) {
        if (operator === "+") {
            operator = "-";
            fullOperationScreen.textContent = firstNumber + operator + content;
        } else if (operator === "-") {
            operator = "+";
            fullOperationScreen.textContent = firstNumber + operator + content;
        } else if (operator) {
            if (screen.textContent.startsWith("-")) {
                screen.textContent = screen.textContent.slice(1);
                fullOperationScreen.textContent = firstNumber + operator + screen.textContent;
            } else {
                screen.textContent = "-" + screen.textContent;
                fullOperationScreen.textContent = firstNumber + operator + screen.textContent;
            }
        } else {
            if (screen.textContent.startsWith("-")) {
                screen.textContent = screen.textContent.slice(1);
                firstNumber = screen.textContent;
                fullOperationScreen.textContent = screen.textContent;
            } else {
                screen.textContent = "-" + screen.textContent;
                firstNumber = screen.textContent;
                fullOperationScreen.textContent = screen.textContent;
            }
        }
    }

    if (event.target.classList.contains("clearAll")) {
        screen.textContent = '';
        fullOperationScreen.textContent = '';
        firstNumber = '';
        secondNumber = '';
        operator = '';
        enableAllButtons();
        document.querySelector(".decimal").disabled = false;
    }

    if (event.target.classList.contains("clear") && content) {
        if (firstNumber && !operator) {
            return;
        }

        if (content.slice(-1) === ".") {
            document.querySelector(".decimal").disabled = false;
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
            if (secondNumber === 0) {
                return "You cannot divide by zero!";
            }
            return firstNumber / secondNumber;
        case '**' :
            return Math.pow(firstNumber, secondNumber);
    }
}


function disableAllButtonsExcept(selector) {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        if (!button.matches(selector)) {
            button.disabled = true;
        }
    });
}


function enableAllButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.disabled = false;
    });
}