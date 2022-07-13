function remove() {
  const text = document.getElementById('query').textContent;
  const newText = text.split('');
  newText.pop();
  document.getElementById('query').textContent = newText.join('');
}

export default remove;