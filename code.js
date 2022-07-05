'use strict';

const round = (nr) => Math.round((nr + Number.EPSILON) * 100) / 100;

/**
 * The calc object literal houses almost all the variables the
 * calculator is driven on. It also contains a number of methods
 * that executes the calculations.
 * Admittedly the way that the +-/* methods are done is not
 * optimal for such simple executions, but they are mainly done so
 * for experimentation.
 */
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
  '+': function () {
    return round(this.firstNr + this.secondNr);
  },
  '-': function () {
    return round(this.firstNr - this.secondNr);
  },
  '/': function () {
    return round(this.firstNr / this.secondNr);
  },
  '*': function () {
    return round(this.firstNr * this.secondNr);
  },
  update() {
    this.firstNr = Number(this.firstValue);
    this.secondNr = Number(this.secondValue);
  },
  calculate() {
    return calc[this.storedOperation]();
  },
  addNumber(nr) {
    calc.equalToggle = false;
    if (this.startToggle) {
      this.text.textContent = nr;
      this.startToggle = false;
    } else if (calc.newNumberToggle) {
      this.text.textContent = nr;
      this.newNumberToggle = false;
    } else {
      this.text.textContent += nr;
    }
  },
};

const resultlog = document.querySelector('#resulttrack');

const buttons = document.querySelectorAll('.number');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    calc.addNumber(button.value);
  });
});

function remove() {
  const text = document.getElementById('query').textContent;
  const newText = text.split('');
  newText.pop();
  calc.newNumberToggle = false;
  calc.equalToggle = false;
  document.getElementById('query').textContent = newText.join('');
}

const removeButton = document.getElementById('remove');

removeButton.addEventListener('click', () => {
  remove();
});

/**
 * The clear function, and associated eventlisteners purpose is
 * simply to reset the calculator. The clear function only resets the
 * ongoing calculations, while the clearLogButton's event listener
 * clears only the log.
 */
function clear() {
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
});

const clearButton = document.getElementById('clear');

clearButton.addEventListener('click', (e) => {
  e.stopPropagation();
  clear();
});

// The logTheResult function creates tje log entry when a calculation is performed.
function logTheResult(result) {
  const log = document.createElement('p');
  const archive = document.createElement('div');
  archive.classList.add('resultblock');
  log.innerHTML = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} = ${result}`;
  log.classList.add('results');
  archive.appendChild(log);
  resultlog.appendChild(archive);
}

/**
 * The recoverResult & associated event listener permits the
 * recovery of a logged result and puts it back into the calculator
 * for further use.
 */
function recoverResult(archive) {
  calc.firstValue = archive.firstValue;
  calc.secondValue = archive.secondValue;
  calc.calcTrack.textContent = `${archive.firstValue} ${archive.storedOperation} ${archive.secondValue} =`;
  calc.text.textContent = archive.result;
}

document.body.addEventListener('click', (e) => {
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
});

/**
 * This function checks the conditions on whether a calculation
 * is legal to proceed with. If that's the case it then calls the
 * update and calculate methods of the calc object.
 * Finally it logs the result with the help of the logTheResult fucntion.
 */
function execute() {
  if (calc.firstValue === '' || calc.storedOperation === '') {
    return;
  }
  if (!calc.equalToggle) {
    calc.equalToggle = true;
    calc.secondValue = Number(calc.text.textContent);
  }
  calc.update();
  const result = calc.calculate();
  if (result === 'Infinity') {
    calc.text.textContent = 'Nice try';
    calc.calcTrack.textContent = "That's infinite";
    logTheResult('Nice try');
    calc.newNumberToggle = true;
    calc.equalToggle = false;
    calc.storedOperation = '';
    calc.operatorHistory = [];
    calc.firstValue = '';
    calc.secondValue = '';
  } else {
    logTheResult(result);
    calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation} ${calc.secondValue} =`;
    calc.firstValue = result;
    calc.text.textContent = result;
    calc.storedOperation = '';
  }
}

/**
 * This function's main purpose is to update the relevant flags
 * to allow the logic to allow a legal calculation.
 */
function control(operation) {
  if (calc.storedOperation && !calc.newNumberToggle) {
    execute();
    calc.storedOperation = operation;
    calc.newNumberToggle = true;
    return;
  }
  calc.storedOperation = operation;
  calc.newNumberToggle = true;
  calc.startToggle = false;
  calc.firstValue = Number(calc.text.textContent);
  calc.calcTrack.textContent = `${calc.firstValue} ${calc.storedOperation}`;
}

/**
 * This function briefly adds a CSS class of hover to
 * the relevant element, and removes it.
 * Thereby simulating a click.
 */
function clickEffect(e) {
  let button;
  if (e.key === 'Enter' || e.target.value === '=') {
    button = document.getElementById('calculatebutton');
  } else if (e.key === 'Backspace') {
    button = document.getElementById('remove');
  } else if (e.key === ',' || e.key === '.') {
    button = document.getElementById('decimal');
  } else {
    button = document.getElementById(`${e.key ? e.key : e.target.value}`);
  }
  button.classList.add('hover');
  setTimeout(() => {
    button.classList.remove('hover');
  }, 100);
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
  if (!calc.text.textContent.includes('.')) {
    if (Number(calc.text.textContent) === 0) {
      calc.text.textContent = '0.';
      calc.startToggle = false;
    } else if (calc.secondValue === '' && calc.storedOperation !== '') {
      calc.text.textContent = '0.';
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
  } else if (e.key === '/' || e.key === '*'
    || e.key === '-' || e.key === '+' || e.key === 'Enter') {
    if (e.key === 'Enter') {
      execute();
      clickEffect(e);
    } else {
      control(e.key);
      clickEffect(e);
    }
  } else if (e.key === ',' || e.key === '.') {
    decimal();
    clickEffect(e);
  } else if (e.key === 'Backspace') {
    remove();
    clickEffect(e);
  }
  e.stopPropagation();
});

const decimalButton = document.querySelector('.decimal');

decimalButton.addEventListener('click', () => {
  decimal();
});
