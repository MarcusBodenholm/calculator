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

export default clickEffect;