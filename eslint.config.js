// eslint.config.js
import eslintPluginSecurity from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security: eslintPluginSecurity
    },
    rules: {
      'security/detect-object-injection': 'error'
    }
  }
];