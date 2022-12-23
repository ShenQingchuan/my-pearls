import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**'],
  format: ['cjs', 'esm'],
  target: 'node16',
  clean: true,
  dts: true,
  splitting: false,
  legacyOutput: true,
})
