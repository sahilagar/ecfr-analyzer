/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure Tailwind doesn't purge our custom classes
  safelist: [
    'max-w-4xl',
    'mx-auto',
    'text-center',
    'font-extrabold',
    'h-40',
    'h-180',
    'h-200',
    'aspect-2.5',
  ],
} 