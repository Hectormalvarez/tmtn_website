import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextConfig from 'eslint-config-next';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const config = [
  { ignores: ['node_modules/**', '.next/**', 'out/**'] },
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextConfig,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'react/react-in-jsx-scope': 0,
      'react/no-undef': 0,
    },
  },
];

export default config;
