let text = document.getElementById('query');
let calcTrack = document.getElementById('calculationTracker');
let firstValue = '';
let secondValue = '';
let storedOperation = ''; //This stores the latest selected operation. Suggestion: Refactor code to utilize operatorHistory?
let newNumberToggle = false; //This toggle is set to true when an operation has been selected, and tells the code to begin a new numberline if a number is entered.
let startToggle = true; //This tells the code to not consider the 0 that sits at the start. It's removed when entering any number
let operatorHistory = []; //Used to keep track of the latest operations. 
const resultlog = document.querySelector('#resulttrack');
const buttons = document.querySelectorAll('.number');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let number = button.value;
        numberFunction(number);
    })
})
const numberFunction = (number) => {
    if (startToggle) {
        text.textContent = number;
        startToggle = false;
    } else if (newNumberToggle) {
        text.textContent = number;
        newNumberToggle = false;
    } else {
        text.textContent += number;
    }
}
const roundingFunction = (nr) => Math.round((nr + Number.EPSILON) * 100) / 100;
    
const calculate = (firstNumber, secondNumber, operation) => {
    let firstNr = Number(firstNumber)
    let secondNr = Number(secondNumber)
    if (operation == '+') {
        return roundingFunction(firstNr + secondNr);
    } else if (operation == '-') {
        return roundingFunction(firstNr - secondNr);
    } else if (operation == 'x' || operation == '*') {
        return roundingFunction(firstNr * secondNr);
    } else if (operation == '/') {
        return roundingFunction(firstNr / secondNr);
    } 
}
const removeFunction = () => {
    let text = document.getElementById('query').textContent;
    let newText = text.split('');
    newText.pop();
    document.getElementById('query').textContent = newText.join('');
    // firstValue.split('').pop().join('');
}
const remove = document.getElementById('remove');
remove.addEventListener('click', () => {
    removeFunction();
})
const clearFunction = () => {
    text.textContent = '0';
    newNumberToggle = false;
    storedOperation = '';
    firstValue = '';
    secondValue = '';
    calcTrack.textContent = '';
    startToggle = true;
    operatorHistory = [];
    while (resultlog.lastElementChild) {
        resultlog.removeChild(resultlog.lastElementChild);
    }
}
const clear = document.getElementById('clear');
clear.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFunction();
})
const logTheResult = (result) => {
    let log = document.createElement('p');
    let display = document.createElement('p');
    let archive = document.createElement('div');
    archive.classList.add('resultblock');
    log.innerHTML = `${firstValue} ${storedOperation} ${secondValue} =`;
    display.innerHTML = `${result}`
    log.classList.add('results');
    display.classList.add('results');
    archive.appendChild(log);
    archive.appendChild(display);
    resultlog.appendChild(archive);

}
const operate = (operation) => {
    if (firstValue == '' && operation == '=') { 
        //purpose is to NOT perform any operation if nothing has been inputted and = is pressed
        return;
    }
    if (!operatorHistory[0]) {
        if (operation !== '=') {
        /*  Purpose is that if there's no operation stored and operation pressed is not =
            then the operation is stored for the rest of the program. */
            operatorHistory.push(operation);
        }
    }
    if (storedOperation == '' && !startToggle && operatorHistory[0] || operatorHistory[operatorHistory.length-1] == '=' && operation !== '=' && !startToggle && operatorHistory[0]) {
/*      A meaty if (Note to self: could probably be made simpler). It permits this if to proceed if
        A) If there's no stored operation AND the startToggle (which is removed when a number is entered the first time) AND if an operation has been stored before
        B) If the second to last operation is = AND the current operation is not = AND the start toggle is false AND there's an entry in the operatorHistory array. */
        storedOperation = operation;
        operatorHistory.push(operation)
        firstValue = Number(text.textContent);
        startToggle = false;
        newNumberToggle = true;
        calcTrack.textContent = `${firstValue} ${storedOperation}`;
    } else if (storedOperation !== '' || operation == '=' && !startToggle && operatorHistory[0]) {
        /*This else if block executes in the following circumstances
        A) If the current operation is not empty
        B) If the operation is = AND the startToggle is false AND there's at least one entry in the operatorhistory array */
        if (operation == '=' && operatorHistory[operatorHistory.length-1] !== '=') {
            secondValue = Number(text.textContent);
        } else if (operatorHistory[operatorHistory.length-1] !== '=') {
            secondValue = Number(text.textContent);
        }
        operatorHistory.push(operation);
        let result = calculate(firstValue, secondValue, storedOperation)
        if (result == 'Infinity') {
            text.textContent = 'Nice try'
            calcTrack.textContent = "That's infinite";
            logTheResult('Nice try');
            newNumberToggle = true;
            storedOperation = '';
            operatorHistory = [];
            firstValue = '';
            secondValue = '';
        } else {
            logTheResult(result)
            calcTrack.textContent = `${firstValue} ${storedOperation} ${secondValue} =`; 
            firstValue = result;   
            text.textContent = result;
            if (operation !== ('=')) {
                storedOperation = operation;
            }
            newNumberToggle = true;
        }
    }
}
document.body.addEventListener('keydown', (e) => {
    if (e.key == '/') {
        e.preventDefault();
    }
})
const operations = document.querySelectorAll('.operation');
operations.forEach(operation => {
    operation.addEventListener('click', (e) => {
        operate(e.target.value);
    })
})
const clickEffect = (e) => {
    let button;
    if (e.key == 'Enter') {
        button = document.getElementById('calculatebutton')
    } else if (e.key == 'Backspace') {
        button = document.getElementById('remove')
    } else if (e.key == ',' || e.key == '.') {
        button = document.getElementById('decimal')
    } else {
        button = document.getElementById(`${e.key}`)
    };
    button.classList.add('hover');
    this.setTimeout(() => {
        button.classList.remove('hover')
    }, 100)
}
window.addEventListener('keydown', function(e) {
    if (e.key == 'Enter') {
        e.preventDefault();
    }
    if (e.key == 'Shift') {
        return;
    }
    if (Number(e.key) > -1 && Number(e.key) < 10) {
        numberFunction(Number(e.key));
        clickEffect(e);
    } else if (e.key == '/' || e.key == '*' || e.key == '-' || e.key == '+' || e.key == 'Enter') {
        if (e.key == 'Enter') {
            operate('=');
            clickEffect(e);
        } else  {
            operate(e.key);
            clickEffect(e);
        }
    } else if (e.key == ',' || e.key == '.' ) {
        decimalFunction();
        clickEffect(e);
    } else if (e.key == 'Backspace') {
        removeFunction();
        clickEffect(e);
    }
    e.stopPropagation();
})
const decimalFunction = () => {
    let decimalCheck = text.textContent.split('');
    if (!decimalCheck.includes('.')) {
        if (Number(text.textContent) == 0) {
            text.textContent = '0.'
            startToggle = false;
        } else if (secondValue == '' && operatorHistory[0]) {
            text.textContent = '0.'
            newNumberToggle = false;
        } else {
            numberFunction('.');
        }
    }
}
const decimal = document.querySelector('.decimal');
decimal.addEventListener('click', () => {
    decimalFunction();
})