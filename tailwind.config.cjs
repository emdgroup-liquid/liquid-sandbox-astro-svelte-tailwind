/** @type {import('tailwindcss').Config} */
const liquidPreset = require("@emdgroup-liquid/liquid/dist/css/tailwind-preset.js");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [liquidPreset],
};
