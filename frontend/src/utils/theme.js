// src/utils/theme.js
export function applyRootThemeVars(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.style.setProperty('--bg', '#000000');
    root.style.setProperty('--text', '#ffffff');
  } else {
    root.style.setProperty('--bg', '#ffffff');
    root.style.setProperty('--text', '#000000');
  }
}
