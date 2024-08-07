// packages/core/builds/lib/rollup.config.js

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  // ES Module Configuration
  {
    input: '../../app/lib/index.ts', // Ensure this path points to the source entry
    output: {
      file: './dist/prez-lib.js', // ES Module output
      format: 'esm',              // ES Module format
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),                  // Minify the output
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        emitDeclarationOnly: true // Emit only declaration files
      })
    ]
  },
  // CommonJS Configuration
  {
    input: '../../app/lib/index.ts', // Ensure this path points to the source entry
    output: {
      file: './dist/prez-lib.umd.cjs', // CommonJS output
      format: 'cjs',                   // CommonJS format
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),                  // Minify the output
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
