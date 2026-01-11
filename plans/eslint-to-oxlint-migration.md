# ESLint to Oxc (oxlint) Migration Plan

## Overview
Migrate Orange-Snap from ESLint to Oxc's linter (oxlint) for improved performance and modern JavaScript/TypeScript linting.

## Current State Analysis

### Existing ESLint Setup
- **ESLint version**: 9.x
- **Config package**: eslint-config-next 16.1.1
- **Configuration files**: None found in project root
- **Usage**: Only used in package.json scripts

### Why Migrate to oxlint?
- **Performance**: oxlint is 10-100x faster than ESLint (written in Rust)
- **Compatibility**: Works seamlessly with TypeScript and React
- **Zero-config**: Sensible defaults out of the box
- **Modern**: Part of VoidZero's next-generation toolchain

## Migration Steps

### Step 1: Remove ESLint Dependencies
Remove the following from [`package.json`](../package.json:1):
```json
"eslint": "^9",
"eslint-config-next": "16.1.1"
```

### Step 2: Install oxlint
Add oxlint as a dev dependency:
```bash
pnpm add -D oxlint
```

### Step 3: Create oxlint Configuration
Create [`oxlint.json`](../oxlint.json:1) in the project root:

```json
{
  "categories": {
    "correctness": "warn",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn",
    "restriction": "warn"
  },
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignore": [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "*.config.js",
    "*.config.mjs",
    "next-env.d.ts"
  ]
}
```

### Step 4: Update package.json Scripts
Replace the lint script in [`package.json`](../package.json:6):

**Before:**
```json
"lint": "next lint"
```

**After:**
```json
"lint": "oxlint",
"lint:fix": "oxlint --fix"
```

### Step 5: Update VSCode Settings
Update [`.vscode/settings.json`](../.vscode/settings.json:1) (create if doesn't exist):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": false,
    "source.organizeImports": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Step 6: Update VSCode Extensions
Remove or disable ESLint extension:
- `dbaeumer.vscode-eslint`

Install oxlint extension (if available) or use generic linter support.

### Step 7: Test the Migration
Run oxlint to verify everything works:
```bash
pnpm run lint
```

### Step 8: Clean Up
Remove any ESLint-related files:
- `.eslintrc*` (if any)
- `eslint.config.*` (if any)

## oxlint Configuration Options

### Categories
oxlint organizes rules into categories:
- `correctness`: Code that is definitely incorrect
- `suspicious`: Code that might be incorrect
- `perf`: Performance issues
- `style`: Code style issues
- `restriction`: Restrict certain language features

### Rule Severity
Can be set to:
- `error`: Will cause lint to fail
- `warn`: Will show warnings but won't fail
- `off`: Disable the rule

## Compatibility Notes

### Next.js Specific Rules
oxlint doesn't have Next.js-specific rules like `next/image`, `next/link`, etc. However:
- Most Next.js best practices are covered by general TypeScript/React rules
- Next.js build process still provides its own checks
- Consider using `next lint` in CI for Next.js-specific validation if needed

### TypeScript Support
oxlint has excellent TypeScript support out of the box:
- Type-aware linting is not needed (oxlint focuses on syntax and patterns)
- Works seamlessly with `tsconfig.json`

## Performance Comparison

| Tool | Files | Time |
|------|-------|------|
| ESLint | 4800+ | ~5-10s |
| oxlint | 4800+ | ~0.7s |

## Rollback Plan
If issues arise, rollback is simple:
1. Restore ESLint dependencies in package.json
2. Remove oxlint configuration
3. Restore original lint scripts

## Post-Migration Verification Checklist

- [ ] oxlint runs without errors
- [ ] All existing code passes linting
- [ ] CI/CD pipeline updated
- [ ] VSCode integration works
- [ ] Team documentation updated

## Resources

- [oxlint Documentation](https://oxc.rs/docs/guide/usage/linter/cli.html)
- [oxlint GitHub](https://github.com/oxc-project/oxc)
- [oxlint npm](https://www.npmjs.com/package/oxlint)
- [Oxc Project](https://oxc.rs)
