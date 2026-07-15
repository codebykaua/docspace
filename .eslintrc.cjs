module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2022: true,
        worker: true,
    },
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    extends: ["eslint:recommended"],
    ignorePatterns: ["dist/", "node_modules/", "render-server/", "docs/archive/"],
    rules: {
        "no-unused-vars": "off",
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-control-regex": "off",
    },
};
