// Selecting the container of buttons
let input = document.querySelector(".buttons");

// Variables to store the first number, second number, operator, and state of entering a number
let firstNumber = '';
let secondNumber = '';
let operator = '';
let enteringNumber = false;
const maxDigits = 12; // Maximum number of digits on the screen


// Event listener for click events on the button container
input.addEventListener('click', function(event) {
    let screen = document.querySelector(".numberDisplay");
    let fullOperationScreen = document.querySelector(".operationDisplay");
    const target = event.target;
    const classList = target.classList;

    // Switch statement to handle different button clicks based on their class
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


// Function to perform arithmetic operations based on the operator
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
        case '^' :
            result = Math.pow(firstNumber, secondNumber);
            break;
    }

    return parseFloat(result.toFixed(4)); // Result rounded to 4 decimals 
}


// Function to handle digit button clicks
function handleDigit(target, screen, fullOperationScreen) {
    if (screen.textContent.length >= maxDigits) return;

    // Logic for entering second number after operator
    if (firstNumber && operator && !enteringNumber) {
        screen.textContent = '';
        secondNumber = '';
        enteringNumber = true;
    } else if (firstNumber && !operator) {
        // Clear screens and reset firstNumber after completing a previous operation
        screen.textContent = '';
        fullOperationScreen.textContent = '';
        firstNumber = '';
    }

    // Handle input starting from 0
    if (screen.textContent.slice(0, 1) === "0" && screen.textContent.length === 1) {
        screen.textContent = '';
        fullOperationScreen.textContent = operator ? fullOperationScreen.textContent.slice(0, -1) : '';
    }

    // Update the screens
    screen.textContent += target.getAttribute('data-value');
    fullOperationScreen.textContent += target.getAttribute('data-value');
}


// Function to handle operator button clicks
function handleOperator(target, screen, fullOperationScreen) {
    // Ignore operator button click if there is no input
    if (!screen.textContent) return;

    if (firstNumber) {
        if (operator) {
            // Case: Performing chained operation
            // Store second number, calculate result with current operator, and reset second number
            secondNumber = screen.textContent;
            firstNumber = operate(firstNumber, operator, secondNumber);
            secondNumber = '';
        } else {
            firstNumber = screen.textContent;
        }
    } else {
        // Case: Starting a new calculation
        // Capture the first number input from the screen
        firstNumber = screen.textContent;

        // Ensure proper formatting if first number ends with a decimal point
        if (firstNumber.slice(-1) === ".") {
            firstNumber += "0";
        }
    }

    screen.textContent = '';

    // Handle division by zero error
    if (firstNumber === "You cannot divide by zero!") {
        screen.textContent = firstNumber;
        fullOperationScreen.textContent = '';
        firstNumber = '';
        secondNumber = '';
        operator = '';
        disableAllButtonsExcept(".clearAll");
        return;
    }

    // Set the operator and update operation screen
    operator = target.getAttribute('data-value');

    fullOperationScreen.textContent = firstNumber + operator;

    enteringSecondNumber = false;
    document.querySelector(".decimal").disabled = false;
}


// Function to handle equal button click
function handleEqual(screen, fullOperationScreen) {
    // Ignore equal button click if there is no input
    if (!screen.textContent) return;

    if (firstNumber && operator) {
        secondNumber = screen.textContent;

        // Append "0" if the second number ends with a decimal point
        if (secondNumber.slice(-1) === ".") {
            fullOperationScreen.textContent += "0";
        }

        // Perform operation and handle division by zero error
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

        // Update the screen
        screen.textContent = firstNumber;

        if (fullOperationScreen.textContent.length <  maxDigits) {
            fullOperationScreen.textContent += '=' + firstNumber;
        } else {
            fullOperationScreen.textContent = firstNumber;
        }

        // Reset variables and enable decimal button
        secondNumber = '';
        operator = '';
        document.querySelector(".decimal").disabled = false;
    }
}


// Function to handle decimal button click
function handleDecimal(screen, fullOperationScreen) {
    fullOperationScreen.textContent += screen.textContent ? "." : "0.";
    screen.textContent += screen.textContent ? "." : "0.";

    // Logic for entering a new number after operator input
    if (firstNumber) {
        if (operator) {
            enteringNumber = true;
        } else {
            // Entering decimals after starting new calculation
            firstNumber = '';
            screen.textContent = "0.";
            fullOperationScreen.textContent = "0.";
        }
    }

    // Disable decimal button after use
    document.querySelector(".decimal").disabled = true;
}


// Function to handle sign change button click
function handleSignChange(screen, fullOperationScreen) {
    // Return if no number entered yet
    if (!screen.textContent) return;

    // Toggle sign of the number or operator
    if (operator === "+" || operator === "-") {
        operator = operator === "+" ? "-" : "+";
    } else {
        screen.textContent = screen.textContent.startsWith("-") ? screen.textContent.slice(1) : "-" + screen.textContent;
    }

    // Updating full operation screen
    if (operator) {
        fullOperationScreen.textContent = firstNumber + operator + screen.textContent;
    } else {
        fullOperationScreen.textContent = screen.textContent;
    }
}


// Clear all screens and reset variables
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
    // Return if no number entered yet
    if (!screen.textContent) return;
    // ignore clearing the last character of finished calculation
    if (firstNumber && !operator) return;

    // Enable decimal button if removing decimal point
    if (screen.textContent.slice(-1) === ".") {
        document.querySelector(".decimal").disabled = false;
    }

    // Remove last character from screen displays
    screen.textContent = screen.textContent.slice(0, -1);
    fullOperationScreen.textContent = fullOperationScreen.textContent.slice(0, -1);
}


// Function to disable all buttons except specified selector
function disableAllButtonsExcept(selector) {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        if (!button.matches(selector)) {
            button.disabled = true;
        }
    });
}


// Function to enable all buttons
function enableAllButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.disabled = false;
    });
}