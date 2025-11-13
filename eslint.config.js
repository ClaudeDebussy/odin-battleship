import pluginJest from 'eslint-plugin-jest';

export default [
  // ... other configurations
  {
    files: ['**/*.test.js', '**/*.spec.js'], // Or other test file patterns
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        jest: true, // Enables Jest global variables
        // Add other Jest globals if needed, like 'describe', 'it', 'expect'
      },
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules, // Recommended Jest rules
      // ... your specific Jest-related rules
    },
  },
];