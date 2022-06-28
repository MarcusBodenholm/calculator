const calc = {
    text: document.getElementById('query'),
    calcTrack: document.getElementById('calculationTracker'),
    firstValue: '',
    secondValue: '',
    storedOperation: '',
    newNumberToggle: false,
    startToggle: true,
    equalToggle: false,
    firstNr: 0,
    secondNr: 0,
    operatorHistory: [],
    "+": function(){
        return roundingFunction(this.firstNr +this.secondNr);
    },
    "-": function(){
        return roundingFunction(this.firstNr-this.secondNr);
    },
    "/": function(){
        return roundingFunction(this.firstNr/this.secondNr);
    },
    "*": function(){
        return roundingFunction(this.firstNr*this.secondNr);
    },
    calculate(){
        this.firstNr = Number(this.firstValue);
        this.secondNr = Number(this.secondValue);
        return calc[this.storedOperation]();
    },
    numberFunction(nr){
        calc.equalToggle = false;
        if(this.startToggle){
            this.text.textContent = nr;
            this.startToggle = false;
        } else if (calc.newNumberToggle){
            this.text.textContent = nr;
            this.newNumberToggle = false;
        } else {
            this.text.textContent += nr;
        }
    }
}
const resultlog = document.querySelector('#resulttrack');
const buttons = document.querySelectorAll('.number');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let number = button.value;
        calc.numberFunction(number);
    })
})
const roundingFunction = (nr) => Math.round((nr + Number.EPSILON) * 100) / 100;
const removeFunction = () => {
    let text = document.getElementById('query').textContent;
    let newText = text.split('');
    newText.pop();
    calc.newNumberToggle = false;
    calc.equalToggle = false;
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
    calc.equalToggle = false;
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
function control() {
    if (!calc.operatorHistory[0] && !calc.equalToggle) {
        /*  Purpose is that if there's no operation stored and operation pressed is not =
            then the operation is stored for the rest of the program. */
            calc.operatorHistory.push(calc.storedOperation);
    }
    if (calc.storedOperation == '' && !calc.startToggle && calc.operatorHistory[0] || 
    !calc.equalToggle && !calc.startToggle && calc.operatorHistory[0]) {
/*      A meaty if (Note to self: could probably be made simpler). It permits this if to proceed if
        A) If there's no stored operation AND the startToggle is false (which is set to false when a number is entered the first time) 
        AND if an operation has been stored before
        B) If the second to last operation is = AND the current operation is not = AND the start toggle is false 
        AND there's an entry in the operatorHistory array. */
        calc.operatorHistory.push(calc.storedOperation)
        calc.firstValue = Number(calc.text.textContent);
        calc.startToggle = false;
        calc.newNumberToggle = true;
        calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation}`;
    } else if (calc.operatorHistory[calc.operatorHistory.length-1] !== '' || 
                calc.equalToggle && !calc.startToggle && calc.operatorHistory[0]) {
        /*This else if block executes in the following circumstances
        A) If the current operation is not empty
        B) If the operation is = AND the startToggle is false AND there's at least one entry in the operatorhistory array */
        if (calc.equalToggle && calc.operatorHistory[calc.operatorHistory.length-1] !== '='){
            calc.secondValue = Number(calc.text.textContent);
            calc.operatorHistory.push('=')
        } else if (!calc.equalToggle) {
            calc.operatorHistory.push(calc.storedOperation);
        }
        let result = calc.calculate()
        if (result == 'Infinity') {
            calc.text.textContent = 'Nice try'
            calc.calcTrack.textContent = "That's infinite";
            logTheResult('Nice try');
            calc.newNumberToggle = true;
            calc.equalToggle = false;
            calc.storedOperation = '';
            calc.operatorHistory = [];
            calc.firstValue = '';
            calc.secondValue = '';
        } else {
            logTheResult(result)
            calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} =`; 
            calc.firstValue = result;   
            calc.text.textContent = result;
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
        if (e.target.value == '=') {
            if (calc.firstValue === ''){
                return;
            } else {
                calc.equalToggle = true;
                control();
                clickEffect(e);
            }
        } else  {
            calc.storedOperation = e.target.value;
            control();
            clickEffect(e);
        }
    })
})
function clickEffect(e) {
    console.log(e)
    let button;
    if (e.key == 'Enter' || e.target.value === '=') {
        button = document.getElementById('calculatebutton')
    } else if (e.key == 'Backspace') {
        button = document.getElementById('remove')
    } else if (e.key == ',' || e.key == '.') {
        button = document.getElementById('decimal')
    } else {
        button = document.getElementById(`${e.key ? e.key : e.target.value}`)
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
        calc.numberFunction(Number(e.key));
        clickEffect(e);
    } else if (e.key == '/' || e.key == '*' || e.key == '-' || e.key == '+' || e.key == 'Enter') {
        if (e.key == 'Enter') {
            if (calc.firstValue === ''){
                return;
            } else {
                calc.equalToggle = true;
                control();
                clickEffect(e);
            }
        } else  {
            calc.storedOperation = e.key;
            control();
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
            calc.numberFunction('.');
        }
    }
}
const decimal = document.querySelector('.decimal');
decimal.addEventListener('click', () => {
    decimalFunction();
})