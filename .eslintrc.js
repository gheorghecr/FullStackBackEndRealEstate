module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-param-reassign': 0,
        'prefer-destructuring': ['error', { object: true, array: false }],
        indent: ['error', 4],
    },
};
