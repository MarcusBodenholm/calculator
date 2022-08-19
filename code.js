'use strict';

import round from "./modules/round.js"
import remove from "./modules/remove.js"
import clickEffect from "./modules/clickEffect.js";

let input = document.getElementById('query');
let calcTracker = document.getElementById('calculationTracker');
let firstValue = '';
let secondValue = '';
let storedOperation = '';

const calc = {
  newNumberToggle: false,
  startToggle: true,
  equalToggle: false,
  '+': function () {
    return round(Number(firstValue) + Number(secondValue));
  },
  '-': function () {
    return round(Number(firstValue) - Number(secondValue));
  },
  '/': function () {
    return round(Number(firstValue) / Number(secondValue));
  },
  '*': function () {
    return round(Number(firstValue) * Number(secondValue));
  },
  calculate() {
    return calc[storedOperation]();
  },
  addNumber(nr) {
    this.equalToggle = false;
    if (this.startToggle) {
      input.textContent = nr;
      this.startToggle = false;
    } else if (this.newNumberToggle) {
      input.textContent = nr;
      this.newNumberToggle = false;
    } else {
      input.textContent += nr;
    }
  },
  clear() {
    input.textContent = '0';
    this.newNumberToggle = false;
    storedOperation = '';
    firstValue = '';
    secondValue = '';
    calcTracker.textContent = '';
    this.startToggle = true;
    this.equalToggle = false;
  }

};

const resultlog = document.querySelector('#resulttrack');

const buttons = document.querySelectorAll('.number');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    calc.addNumber(button.value);
  });
});


const removeButton = document.getElementById('remove');

removeButton.addEventListener('click', () => {
  remove();
  calc.newNumberToggle = false;
  calc.equalToggle = false;
});


const clearLogButton = document.getElementById('clearlog');

clearLogButton.addEventListener('click', () => {
  while (resultlog.lastElementChild) {
    resultlog.removeChild(resultlog.lastElementChild);
  }
});

const clearButton = document.getElementById('clear');

clearButton.addEventListener('click', (e) => {
  e.stopPropagation();
  calc.clear();
});

// The logTheResult function creates tje log entry when a calculation is performed.
function logTheResult(result) {
  const log = document.createElement('p');
  const archive = document.createElement('div');
  archive.classList.add('resultblock');
  log.innerHTML = `${firstValue} ${storedOperation} ${secondValue} = ${result}`;
  log.classList.add('results');
  log.addEventListener('click', recovery);
  archive.appendChild(log);
  resultlog.appendChild(archive);
}

/**
 * The recoverResult & associated event listener permits the
 * recovery of a logged result and puts it back into the calculator
 * for further use.
 */
function recoverResult(archive) {
  firstValue = archive.firstValue;
  secondValue = archive.secondValue;
  calcTracker.textContent = `${archive.firstValue} ${archive.storedOperation} ${archive.secondValue} =`;
  input.textContent = archive.result;
}

function recovery(e) {
  const divided = e.target.textContent.split(' ');
  const archive = {
    firstValue: divided[0],
    storedOperation: divided[1],
    secondValue: divided[2],
    result: divided[4],
  };
  recoverResult(archive);
}
/* document.body.addEventListener('click', (e) => {
  if (e.target.classList.value === 'results') {
    const divided = e.target.textContent.split(' ');
    const archive = {
      firstValue: divided[0],
      storedOperation: divided[1],
      secondValue: divided[2],
      result: divided[4],
    };
    recoverResult(archive);
  }
}); */

/**
 * This function checks the conditions on whether a calculation
 * is legal to proceed with. If that's the case it then calls the
 * update and calculate methods of the calc object.
 * Finally it logs the result with the help of the logTheResult fucntion.
 */
function execute() {
  if (firstValue === '' || storedOperation === '') {
    return;
  }
  if (!calc.equalToggle) {
    calc.equalToggle = true;
    secondValue = Number(input.textContent);
  }
  const result = calc.calculate();
  if (result === 'Infinity') {
    input.textContent = 'Nice try';
    calcTracker.textContent = "That's infinite";
    logTheResult('Nice try');
    calc.newNumberToggle = true;
    calc.equalToggle = false;
    storedOperation = '';
    firstValue = '';
    secondValue = '';
  } else {
    logTheResult(result);
    calcTracker.textContent = `${firstValue} ${storedOperation} ${secondValue} =`;
    firstValue = result;
    input.textContent = result;
  }
}

/**
 * This function's main purpose is to update the relevant flags
 * to allow the logic to allow a legal calculation.
 */
function control(operation) {
  if (storedOperation && !calc.newNumberToggle && storedOperation === operation) {
    storedOperation = operation;
    execute();
    calc.newNumberToggle = true;
    return;
  }
  storedOperation = operation;
  calc.newNumberToggle = true;
  calc.startToggle = false;
  firstValue = Number(input.textContent);
  calcTracker.textContent = `${firstValue} ${storedOperation}`;
}

// An eventlistener to prevent the default action of /
document.body.addEventListener('keydown', (e) => {
  if (e.key === '/') {
    e.preventDefault();
  }
});

const operations = document.querySelectorAll('.operation');

operations.forEach((operation) => {
  operation.addEventListener('click', (e) => {
    if (e.target.value === '=') {
      execute();
      clickEffect(e);
    } else {
      control(e.target.value);
      clickEffect(e);
    }
  });
});

function decimal() {
  if (!input.textContent.includes('.')) {
    if (Number(input.textContent) === 0) {
      input.textContent = '0.';
      calc.startToggle = false;
    } else if (secondValue === '' && storedOperation !== '') {
      input.textContent = '0.';
      calc.newNumberToggle = false;
    } else {
      calc.addNumber('.');
    }
  }
}

/**
 * Below is an eventlistener that allows the use of
 * the numpad keys.They also trigger an effect to provide
 * feedback to the keypresses.
 */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
  if (e.key === 'Shift') {
    return;
  }
  if (Number(e.key) > -1 && Number(e.key) < 10) {
    calc.addNumber(Number(e.key));
    clickEffect(e);
  }
  if (e.key === '/' || e.key === '*'
    || e.key === '-' || e.key === '+' || e.key === 'Enter') {
    if (e.key === 'Enter') {
      execute();
      clickEffect(e);
    } else {
      control(e.key);
      clickEffect(e);
    }
  }
  if (e.key === ',' || e.key === '.') {
    decimal();
    clickEffect(e);
  }
  if (e.key === 'Backspace') {
    remove();
    clickEffect(e);
  }
  e.stopPropagation();
});

const decimalButton = document.querySelector('.decimal');

decimalButton.addEventListener('click', () => {
  decimal();
});
