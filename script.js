let input = document.querySelector(".buttons");
let firstNumber = '';
let secondNumber = '';
let operator = '';
let enteringNumber = false;


input.addEventListener('click', function(event) {
    let screen = document.querySelector(".numberDisplay");
    let fullOperationScreen = document.querySelector(".operationDisplay");
    const target = event.target;
    const classList = target.classList;

    switch(true) {
        case classList.contains("digit"):
            handleDigit(target, screen, fullOperationScreen);
            break;
        case classList.contains("operator"):
            handleOperator(target, screen, fullOperationScreen);
            break;
        case classList.contains("equal"):
            handleEqual(screen, fullOperationScreen);
            break;
        case classList.contains("decimal"):
            handleDecimal(screen, fullOperationScreen);
            break;
        case classList.contains("sign-change"):
            handleSignChange(screen, fullOperationScreen);
            break;
        case classList.contains("clearAll"):
            clearAll(screen, fullOperationScreen);
            break;
        case classList.contains("clear"):
            clear(screen, fullOperationScreen);
            break;
    }
});


function operate(firstNumber, operator, secondNumber) {
    firstNumber = parseFloat(firstNumber);
    secondNumber = parseFloat(secondNumber);
    let result;

    switch(operator) {
        case '+' :
            result = firstNumber + secondNumber;
            break;
        case '-' :
            result = firstNumber - secondNumber;
            break;
        case '*' :
            result = firstNumber * secondNumber;
            break;
        case '/' :
            if (secondNumber === 0) {
                return "You cannot divide by zero!";
            }

            result = firstNumber / secondNumber;
            break;
        case '**' :
            result = Math.pow(firstNumber, secondNumber);
            break;
    }

    return result.toFixed(4);
}


function handleDigit(target, screen, fullOperationScreen) {
    const maxDigits = 12;
    if (screen.textContent.length >= maxDigits) return;

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
        fullOperationScreen.textContent = operator ? fullOperationScreen.textContent.slice(0, -1) : '';
    }

    screen.textContent += target.getAttribute('data-value');
    fullOperationScreen.textContent += target.getAttribute('data-value');
}


function handleOperator(target, screen, fullOperationScreen) {
    if (!screen.textContent) return;

    if (firstNumber) {
        if (operator) {
            secondNumber = screen.textContent;
            firstNumber = operate(firstNumber, operator, secondNumber);
            secondNumber = '';
        }
    } else {
        firstNumber = screen.textContent;

        if (firstNumber.slice(-1) === ".") {
            firstNumber += "0";
        }
    }

    screen.textContent = '';

    if (firstNumber === "You cannot divide by zero!") {
        screen.textContent = firstNumber;
        fullOperationScreen.textContent = '';
        firstNumber = '';
        secondNumber = '';
        operator = '';
        disableAllButtonsExcept(".clearAll");
        return;
    }

    operator = target.getAttribute('data-value');

    fullOperationScreen.textContent = firstNumber + operator;

    enteringSecondNumber = false;
    document.querySelector(".decimal").disabled = false;
}


function handleEqual(screen, fullOperationScreen) {
    if (!screen.textContent) return;

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


function handleDecimal(screen, fullOperationScreen) {
    fullOperationScreen.textContent += screen.textContent ? "." : "0.";
    screen.textContent += screen.textContent ? "." : "0.";

    if (firstNumber && operator) {
        enteringNumber = true;
    }

    if (firstNumber && !operator) {
        firstNumber = '';
        screen.textContent = "0.";
        fullOperationScreen.textContent = "0.";
    }

    document.querySelector(".decimal").disabled = true;
}


function handleSignChange(screen, fullOperationScreen) {
    if (!screen.textContent) return;

    if (operator === "+" || operator === "-") {
        operator = operator === "+" ? "-" : "+";
    } else {
        screen.textContent = screen.textContent.startsWith("-") ? screen.textContent.slice(1) : "-" + screen.textContent;
    }

    if (operator) {
        fullOperationScreen.textContent = firstNumber + operator + screen.textContent;
    } else {
        fullOperationScreen.textContent = screen.textContent;
    }
}


function clearAll(screen, fullOperationScreen) {
    screen.textContent = '';
    fullOperationScreen.textContent = '';

    firstNumber = '';
    secondNumber = '';
    operator = '';

    enableAllButtons();
    document.querySelector(".decimal").disabled = false;
}


function clear(screen, fullOperationScreen) {
    if (!screen.textContent) return;

    if (firstNumber && !operator) return;

    if (screen.textContent.slice(-1) === ".") {
        document.querySelector(".decimal").disabled = false;
    }

    screen.textContent = screen.textContent.slice(0, -1);
    fullOperationScreen.textContent = fullOperationScreen.textContent.slice(0, -1);
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