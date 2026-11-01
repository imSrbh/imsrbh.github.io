(function () {
  var key = 'portfolio-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function savedTheme() {
    try {
      var value = localStorage.getItem(key);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var button = document.querySelector('.theme-switch');
    if (button) {
      var dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.querySelector('.theme-switch-label').textContent = dark ? 'Light mode' : 'Dark mode';
    }
  }

  applyTheme(savedTheme() || (media && media.matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme'));
    var button = document.querySelector('.theme-switch');
    if (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, next); } catch (error) { /* Storage can be unavailable. */ }
        applyTheme(next);
      });
    }
  });

  if (media && media.addEventListener) {
    media.addEventListener('change', function (event) {
      if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
    });
  }
}());
