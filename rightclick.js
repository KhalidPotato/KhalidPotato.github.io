document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'i' || e.key === 'I' || e.key === 'a' || e.key === 'A' || e.key === 's' || e.key === 'S' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
  }
  if (e.key === 'F12') {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', function (e) {
  e.preventDefault();
});

window.addEventListener('resize', function (e) {
  window.resizeTo(window.outerWidth, window.outerHeight);
});
