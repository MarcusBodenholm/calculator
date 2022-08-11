function remove() {
  const text = document.getElementById('query').textContent;
  const newText = text.slice(0, -1)
  document.getElementById('query').textContent = newText;
}

export default remove;