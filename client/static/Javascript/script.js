// /*
// Code to make the site match the device's dark mode settings
// */
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
//   document.documentElement.setAttribute('data-theme', 'dark'); else
//   document.documentElement.setAttribute('data-theme', 'light');


// let listener = e => {
//   const theme = e.matches ? "dark" : "light";
//   document.documentElement.setAttribute('data-theme', theme);
// }
// window.matchMedia('(prefers-color-scheme: dark)').addListener(listener);
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", listener);