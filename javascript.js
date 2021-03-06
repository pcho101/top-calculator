const add = function(a, b) {
	return a + b;
};

const subtract = function(a, b) {
	return a - b;
};

const multiply = function(a, b) {
	return a * b;
};

const divide = function(a, b) {
    if (b == 0) {
        return 'ERROR';
    }
    return a / b;
};

const operate = function(operator, a, b) {
    a = Number(a);
    b = Number(b);
    if (operator == '+') {
        return add(a, b);
    }
    else if (operator == '-') {
        return subtract(a, b);
    }
    else if (operator == '*') {
        return multiply(a, b);
    }
    else if (operator == '/') {
        return divide(a, b);
    }
}

let displayValue = '0';
let storedValue = '';
let operator = '';
let prevKey = '';
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    button.addEventListener('click', chooseOperation);
});

window.addEventListener('keydown', (e) => {
    const KEYS = [
        '1','2','3','4','5','6','7','8','9','0',
        '/','*','-','+','=','.','x','X',
        'Enter','Backspace','Delete', 'Escape']
    let key = e.key;
    if (!KEYS.includes(key)) {
        return;
    }
    if (key == '*' || key == '+' || key == '/' || key == '=' || key == '.') {
        key = '\\' + key;
    }
    document.querySelector(`.key-${key}`).click();
});

function chooseOperation(e) {
    if (e.target.className.includes('clear')) {
        displayValue = '0';
        storedValue = '';
        operator = '';
        prevKey = '';
        display.textContent = displayValue;
    }
    else if (e.target.className.includes('operator')) {
        if (prevKey == 'operator')
        {
            operator = e.target.textContent;
        }
        else if (prevKey == 'equals') {
            storedValue = displayValue;
            operator = e.target.textContent;
            displayValue = '0';
        }
        else if (prevKey == 'num') {
            if (storedValue) {
                displayValue = operate(operator, storedValue, display.textContent);
                display.textContent = truncate(displayValue);
            }
            storedValue = displayValue;
            operator = e.target.textContent;
            displayValue = '0';
        }
        prevKey = 'operator';
    }
    else if (e.target.className.includes('equals') &&
            prevKey != 'equals' &&
            prevKey != 'operator') {
        if (operator) {
            displayValue = operate(operator, storedValue, displayValue);
            operator = '';
            storedValue = '';
            display.textContent = truncate(displayValue);
        }
        prevKey = 'equals';
    }
    else if (e.target.className.includes('digit')) {
        if (displayValue == '0' ||
            prevKey == 'equals') {
            displayValue = e.target.textContent;
        }
        else {
            displayValue += e.target.textContent;
        }
        display.textContent = truncate(displayValue);
        prevKey = 'num';
    }
    else if (e.target.className.includes('decimal')) {
        if (!displayValue.includes('.')) {
            displayValue += e.target.textContent;
            display.textContent = truncate(displayValue);
        }
    }
    else if (e.target.className.includes('backspace')) {
        if (displayValue != '0') {
            if (displayValue.length == 1) {
                displayValue = '0';
            }
            else {
                displayValue = displayValue.slice(0, displayValue.length - 1);
            }
        }
        display.textContent = truncate(displayValue);
    }
    else if(e.target.className.includes('plus-minus')) {
        console.log(displayValue);
        displayValue = displayValue*-1
        display.textContent = truncate(displayValue);
    }
}

const maxDisplayLength = 8;
const maxDisplayNumber = 10 ** maxDisplayLength - 1;
const minDisplayNumber = -(10 ** (maxDisplayLength - 1) - 1);
const truncate = function(num) {
    let numberString;
    if (num > maxDisplayNumber) {
        const power = Math.round(getBaseLog(10, Math.abs(num)));
        const exponent = 'e' + power.toString();
        const startDigit = num.toString()[0];
        const midDigits = num.toString().slice(1, maxDisplayLength - exponent.length - 1);
        numberString = startDigit + '.' + midDigits + exponent;
    }
    else if (num < minDisplayNumber) {
        const power = Math.round(getBaseLog(10, Math.abs(num)));
        const exponent = 'e' + power.toString();
        const negativeSign = num.toString()[0];
        const startDigit = num.toString()[1];
        const midDigits = num.toString().slice(2, maxDisplayLength - exponent.length - 1);
        numberString = negativeSign + startDigit + '.' + midDigits + exponent;
    }
    else if (num.toString().length > maxDisplayLength) {
        numberString = num.toString().slice(0, maxDisplayLength);
    }
    else {
        numberString = num.toString();
    }
    return numberString;
};

const getBaseLog = function(x, y) {
    return Math.log(y) / Math.log(x);
};