#!/usr/bin/env node
import 'dotenv/config'

import { existsSync, renameSync, cpSync, writeFileSync} from 'fs'
import {readdir} from 'fs/promises'
import path from 'path'
import { createServer, build } from 'vite'
import { spawn } from 'child_process'
import tailwindcss from '@tailwindcss/vite'
import {svelite} from 'svelitecms/vite'

let mode = 'dev'

if(process.argv.includes('build')) {
    mode = 'build'
} else if(process.argv.includes('pack')) {
    mode = 'pack'
} else if(process.argv.includes('deploy')) {
    mode = 'deploy'
} else if(process.argv.includes('preview')) {
    mode = 'preview'
}

init()
 
const plugins = [
    svelite(),
    tailwindcss()
]

if(mode === 'dev') {
    
    const vite = await createServer({
        plugins
    })

    await vite.listen()
    vite.printUrls()

} else if(mode === 'build') {
    const isVercel = process.argv.includes('vercel')
    if(isVercel) {
        cpSync(path.resolve('node_modules/svelitecms/files/.vercel'), './.vercel', {
            recursive: true
        })
    }

    await build({
        plugins,
        build: {
            ssr: true,
            outDir: isVercel ? '.vercel/output/functions/fn.func/server' : 'build/server',
            rollupOptions: {
                input: path.resolve('.svelite/server.js'),
            }
        },
        ssr: {
            target: 'webworker',
        }
    })
    
    await build({
        build: {
            outDir: isVercel ? '.vercel/output/static' : 'build/client',
            rollupOptions: {
                input: '.svelite/index.html',
            }
        },
        plugins
    })
    
    if(isVercel)
    {
        renameSync('./.vercel/output/static/.svelite/index.html', './.vercel/output/functions/fn.func/index.html');
    } else {
        cpSync(path.resolve('node_modules/svelitecms/files/build/index.js'), './build/index.js')
        writeFileSync('./build/package.json', JSON.stringify({type: 'module', dependencies: {
            "express": "^4.18.2",
            "sirv": "^2.0.4",
        }}))
    }
} else if(mode === 'deploy') {
    if(process.argv.includes('vercel')) {
        spawn('vercel', ['deploy', '--prebuilt', '--prod', 'build'])
    }
} else if(mode === 'preview') {
    preview()
    // cd dist && node index.js
} else {
    // pack
    const plugins = await readdir('./plugins')

    for(let plugin of plugins) {
        const hasServer = existsSync('./plugins/' + plugin + '/server.js') || existsSync('./plugins/' + plugin + '/server.ts')

        build({
            plugins,
            build: {
                rollupOptions: {
                    output: {
                        manualChunks: {}
                    },
                    external: ['svelte']
                },
                outDir: './dist/' + plugin,
                emptyOutDir: false,
                lib: {
                    entry: hasServer ? ['./plugins/' + plugin, './plugins/' + plugin + '/server'] : ['./plugins/' + plugin], 
                    formats: ['es']
                }
            }
        })
    } 
}

async function init() {
    if(!existsSync('svelite.config.js')) {
        cpSync(path.resolve('node_modules/svelitecms/files/svelite.config.js'), 'svelite.config.js');
        console.log('svelite.config.js created!')
    }

    if(existsSync('.svelite/client.js')) return;

    cpSync(path.resolve('node_modules/svelitecms/files/.svelite'), '.svelite', {recursive: true});
    console.log('svelite initialized!')
}
