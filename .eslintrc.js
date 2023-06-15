module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "globals": {
        "it": true,
        "describe": true
    },
    "rules": {
        "semi": ["error", "never"],
        "quotes": ["error", "single"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "brace-style": ["off", "stroustrup", { "allowSingleLine": true }],
        "space-before-function-paren": ["error", "never"],
        "arrow-parens": [2, "as-needed"]
    }
}
