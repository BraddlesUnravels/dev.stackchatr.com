import { type Config } from 'prettier';

const config: Config = {
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss']
};

export default config;
