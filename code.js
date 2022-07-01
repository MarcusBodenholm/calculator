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
}
const clearLogButton = document.getElementById('clearlog');
clearLogButton.addEventListener('click', () => {
    while (resultlog.lastElementChild) {
        resultlog.removeChild(resultlog.lastElementChild);
    }
})
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFunction();
})
const logTheResult = (result) => {
    let log = document.createElement('p');
    let archive = document.createElement('div');
    archive.classList.add('resultblock');
    log.innerHTML = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} = ${result}`;
    log.classList.add('results');
    archive.appendChild(log);
    resultlog.appendChild(archive);

}
function recoverResult(archive){
    calc.firstValue = archive.firstValue;
    calc.secondValue = archive.secondValue;
    calc.calcTrack.textContent = `${archive.firstValue} ${archive.storedOperation} ${archive.secondValue} =`; 
    calc.text.textContent = archive.result;
}
document.body.addEventListener('click', (e)=> {
    console.log(e.target.classList.value)
    if (e.target.classList.value === 'results'){
        let divided = e.target.textContent.split(' ');
        const archive = {
            firstValue: divided[0],
            storedOperation: divided[1],
            secondValue: divided[2],
            result: divided[4],
        }
        recoverResult(archive);
    }
})
function execute(){
    if (calc.firstValue === ''){
        return;
    }
    if (calc.equalToggle){

    } else {
        calc.equalToggle = true;
        calc.secondValue = Number(calc.text.textContent)
    }
    let result = calc.calculate();
    if (result == 'Infinity'){
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
        calc.storedOperation = '';
    }

};
function control(operation){
    if (calc.storedOperation && !calc.newNumberToggle){
        execute();
        calc.storedOperation = operation;
        calc.newNumberToggle = true;
        return;
    };
    calc.storedOperation = operation;
    calc.newNumberToggle = true;
    calc.startToggle = false;
    calc.firstValue = Number(calc.text.textContent);
    calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation}`;
};
document.body.addEventListener('keydown', (e) => {
    if (e.key == '/') {
        e.preventDefault();
    }
})
const operations = document.querySelectorAll('.operation');
operations.forEach(operation => {
    operation.addEventListener('click', (e) => {
        if (e.target.value == '=') {
            execute();
            clickEffect(e);
        } else  {
            control(e.target.value);
            clickEffect(e);
        }
    })
})
function clickEffect(e) {
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
            execute();
            clickEffect(e);
        } else  {
            control(e.key);
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
    if (!calc.text.textContent.includes('.')) {
        if (Number(calc.text.textContent) == 0) {
            calc.text.textContent = '0.'
            calc.startToggle = false;
        } else if (calc.secondValue == '' && calc.storedOperation !== '') {
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