class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    // Clear all calculator data
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Delete the last character from the current operand
    delete() {
        if (this.currentOperand === 'Error' || this.currentOperand === 'Infinity') {
            this.clear();
            return;
        }
        if (this.currentOperand.toString().length <= 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    // Append a number or decimal to the current operand
    appendNumber(number) {
        if (this.currentOperand === 'Error' || this.currentOperand === 'Infinity') {
            this.clear();
        }
        if (number === '.' && this.currentOperand.includes('.')) return; // Prevent multiple decimals
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Choose an arithmetic operation
    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand === '' && this.previousOperand !== '') {
            this.operation = operation;
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Perform the calculation
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return; // Exit if numbers are invalid

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error'; // Handle division by zero
                    this.operation = undefined;
                    this.previousOperand = '';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Format the number for display
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update the UI display
    updateDisplay() {
        if (this.currentOperand === 'Error') {
            this.currentOperandTextElement.innerText = 'Error';
            this.previousOperandTextElement.innerText = '';
            return;
        }
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand) || '0';
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// --- DOM Element Selection ---
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// --- Event Listeners ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});

window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= 0 && key <= 9 || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    }
    if (key === '=' || key === 'Enter') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
    if (key === '+' || key === '-') {
        calculator.chooseOperation(key);
        calculator.updateDisplay();
    }
    if (key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }
    if (key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
});
