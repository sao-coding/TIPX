import eslint from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  // TypeScript 設定
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,

  // Next.js 設定
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules
    }
  },

  // Prettier 設定
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error'
    }
  },

  // 全局規則（需要先註冊插件）
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin
    },
    rules: {
      // 全局啟用基本規則
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off'
    }
  },

  // JavaScript/TypeScript 檔案處理
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    // 為 TypeScript 檔案添加解析器
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    // 在特定檔案類型中覆寫 import 排序規則
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // `react` first, `next` second, then packages starting with a character
            ['^react$', '^next', '^[a-z]'],
            // Packages starting with `@`
            ['^@'],
            // Packages starting with `~`
            ['^~'],
            // Imports starting with `../`
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports starting with `./`
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
            // Side effect imports
            ['^\\u0000']
          ]
        }
      ]
    }
  },

  // 忽略檔案
  {
    ignores: ['public/*', '.next/*', 'node_modules/*']
  }
]
