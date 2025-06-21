// src/themes/customizations.js

export const backgrounds = [
  { id: 'bg-default', label: 'Default', class: 'bg-white dark:bg-black' },
  {
    id: 'bg-gradient',
    label: 'Gradient',
    class: 'bg-gradient-to-r from-pink-500 to-purple-500',
  },
  {
    id: 'bg-vapor',
    label: 'Vaporwave',
    class: 'bg-purple-100 dark:bg-purple-900',
  },
  { id: 'bg-neon', label: 'Neon', class: 'bg-pink-900' },
  {
    id: 'bg-solar',
    label: 'Solarized',
    class: 'bg-yellow-100 dark:bg-yellow-200',
  },
];

export const fonts = [
  { id: 'font-sans', label: 'Sans', class: 'font-sans' },
  { id: 'font-duckie', label: 'Duckie', class: 'font-duckie' },
  { id: 'font-damion', label: 'Damion', class: 'font-damion' },
  { id: 'font-yellowtail', label: 'Yellowtail', class: 'font-yellowtail' },
];

export const textColors = [
  {
    id: 'text-default',
    label: 'Default',
    class: 'text-gray-900 dark:text-white',
  },
  { id: 'text-bright', label: 'Bright', class: 'text-pink-200' },
  { id: 'text-muted', label: 'Muted', class: 'text-gray-500' },
  { id: 'text-neon', label: 'Neon', class: 'text-green-400' },
];
