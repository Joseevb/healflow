import { heyApiPlugin } from '@hey-api/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { basename, extname, resolve } from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function autoBarrel(dirs: Array<string>) {
  const generate = async (dir: string) => {
    const glob = new Bun.Glob('*.{ts,tsx}')
    const files = Array.from(glob.scanSync(dir))
      .filter((f) => f !== 'index.ts')
      .map((f) => `export * from './${basename(f, extname(f))}'`)
      .join('\n')

    await Bun.write(resolve(dir, 'index.ts'), files + '\n')
  }

  return {
    name: 'auto-barrel',
    buildStart() {
      dirs.forEach(generate)
    },
    configureServer(server: any) {
      dirs.forEach((dir) => {
        server.watcher.on('add', (f: string) => f.startsWith(dir) && generate(dir))
        server.watcher.on('unlink', (f: string) => f.startsWith(dir) && generate(dir))
      })
    },
  }
}

function kyselyAdapterStub(): Plugin {
  return {
    name: 'kysely-adapter-stub',
    resolveId(id) {
      if (id.startsWith('@better-auth/kysely-adapter')) {
        return '\0kysely-adapter-stub'
      }
    },
    load(id) {
      if (id === '\0kysely-adapter-stub') {
        return `
export function createKyselyAdapter() {
  return { kysely: null, databaseType: null }
}
export function getKyselyDatabaseType() {
  return undefined
}
`
      }
    },
  }
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    kyselyAdapterStub(),
    devtools(),
    nitro({
      preset: 'bun',
      rollupConfig: {
        external: [/^@sentry\//],
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({
      include: /\.[jt]sx?$/,
      presets: [reactCompilerPreset()],
    }),
    autoBarrel([resolve(__dirname, 'src/db/schemas')]),
    heyApiPlugin({
      config: {
        input: process.env.MEDICINES_API_URL!,
        output: 'src/client',
        plugins: ['@tanstack/react-query'],
      },
    }),
  ],
})
