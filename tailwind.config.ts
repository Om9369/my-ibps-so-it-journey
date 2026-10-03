// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './index.html',
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
