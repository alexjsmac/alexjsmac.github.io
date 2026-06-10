import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // The WebGL scene mutates memoized THREE objects inside useFrame on
    // purpose — the standard R3F pattern for 60fps work without React
    // re-renders. The compiler-era hook rules flag exactly that idiom.
    files: ['src/scene/**/*.tsx', 'src/components/ui/HoverPreview.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    // Module-level singletons (scrollControl, moodState) are part of the
    // frame-bus architecture; fast-refresh purity doesn't apply.
    files: ['src/lib/SmoothScroll.tsx', 'src/scene/MoodController.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
