const calc = {
    text: document.getElementById('query'),
    calcTrack: document.getElementById('calculationTracker'),
    firstValue: '',
    secondValue: '',
    storedOperation: '',
    newNumberToggle: false,
    startToggle: true,
    operatorHistory: []
}
const resultlog = document.querySelector('#resulttrack');
const buttons = document.querySelectorAll('.number');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let number = button.value;
        numberFunction(number);
    })
})
const numberFunction = (number) => {
    if (calc.startToggle) {
        calc.text.textContent = number;
        calc.startToggle = false;
    } else if (calc.newNumberToggle) {
        calc.text.textContent = number;
        calc.newNumberToggle = false;
    } else {
        calc.text.textContent += number;
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
}
const remove = document.getElementById('remove');
remove.addEventListener('click', () => {
    removeFunction();
})
const clearFunction = () => {
    calc.text.textContent = '0';
    calc.newNumberToggle = false;
    calc.storedOperation = '';
    calc.firstValue = '';
    calc.secondValue = '';
    calc.calcTrack.textContent = '';
    calc.startToggle = true;
    calc.operatorHistory = [];
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
    log.innerHTML = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} =`;
    display.innerHTML = `${result}`
    log.classList.add('results');
    display.classList.add('results');
    archive.appendChild(log);
    archive.appendChild(display);
    resultlog.appendChild(archive);

}
const operate = (operation) => {
    if (calc.firstValue == '' && operation == '=') { 
        //purpose is to NOT perform any operation if nothing has been inputted and = is pressed
        return;
    }
    if (!calc.operatorHistory[0] && operation !== "=") {
        /*  Purpose is that if there's no operation stored and operation pressed is not =
            then the operation is stored for the rest of the program. */
            calc.operatorHistory.push(operation);
    }
    if (calc.storedOperation == '' && !calc.startToggle && calc.operatorHistory[0] || 
    calc.operatorHistory[calc.operatorHistory.length-1] == '=' && operation !== '=' 
    && !calc.startToggle && calc.operatorHistory[0]) {
/*      A meaty if (Note to self: could probably be made simpler). It permits this if to proceed if
        A) If there's no stored operation AND the startToggle (which is removed when a number is entered the first time) AND if an operation has been stored before
        B) If the second to last operation is = AND the current operation is not = AND the start toggle is false AND there's an entry in the operatorHistory array. */
        calc.storedOperation = operation;
        calc.operatorHistory.push(operation)
        calc.firstValue = Number(calc.text.textContent);
        calc.startToggle = false;
        calc.newNumberToggle = true;
        calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation}`;
    } else if (calc.storedOperation !== '' || operation == '=' && !calc.startToggle && calc.operatorHistory[0]) {
        /*This else if block executes in the following circumstances
        A) If the current operation is not empty
        B) If the operation is = AND the startToggle is false AND there's at least one entry in the operatorhistory array */
        if (operation == '=' && calc.operatorHistory[calc.operatorHistory.length-1] !== '=') {
            calc.secondValue = Number(calc.text.textContent);
        } else if (calc.operatorHistory[calc.operatorHistory.length-1] !== '=') {
            calc.secondValue = Number(calc.text.textContent);
        }
        calc.operatorHistory.push(operation);
        let result = calculate(calc.firstValue, calc.secondValue, calc.storedOperation)
        if (result == 'Infinity') {
            calc.text.textContent = 'Nice try'
            calc.calcTrack.textContent = "That's infinite";
            logTheResult('Nice try');
            calc.newNumberToggle = true;
            calc.storedOperation = '';
            calc.operatorHistory = [];
            calc.firstValue = '';
            calc.secondValue = '';
        } else {
            logTheResult(result)
            calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} =`; 
            calc.firstValue = result;   
            calc.text.textContent = result;
            if (operation !== ('=')) {
                calc.storedOperation = operation;
            }
            calc.newNumberToggle = true;
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
        if (Number(calc.text.textContent) == 0) {
            calc.text.textContent = '0.'
            calc.startToggle = false;
        } else if (calc.secondValue == '' && calc.operatorHistory[0]) {
            calc.text.textContent = '0.'
            calc.newNumberToggle = false;
        } else {
            numberFunction('.');
        }
    }
}
const decimal = document.querySelector('.decimal');
decimal.addEventListener('click', () => {
    decimalFunction();
})