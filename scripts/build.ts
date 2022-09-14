const ncc = require("@vercel/ncc");
import "zx/globals"
import { join } from 'path'
import ts, { createCompilerHost } from 'typescript'

import fs from 'fs'

const rootDir = process.cwd()

async function buildEntry(entry: string) {
    let { code, assets } = await ncc(join(rootDir, `src/${entry}.ts`), {
        // externals: opts.webpackExternals,
        minify: true,
        target: 'es5',
        esm: false,
        // assetBuilds: false,
        // customEmit,
    });
    fs.writeFileSync(join(rootDir, `dist/${entry}.js`), code, 'utf8')
}

async function buildTypes(entries: string[]) {
    const { tsConfig, tsConfigFile } = getTSConfig({
        cwd: rootDir,
        tsConfigFile: 'tsconfig.json',
    });
    const host = createCompilerHost(tsConfig.options);
    const program = ts.createProgram(
        entries.map(entry => join(rootDir, `src/${entry}.ts`)),
        {
            ...tsConfig.options,
            emitDeclarationOnly: true,
            declaration: true,
            sourceMap: false,
            outDir: join(rootDir, `dist`)
        },
        host,
    );
    program.emit();
}

function getTSConfig(opts: { cwd: string; tsConfigFile?: string }) {
    const configPath = opts.tsConfigFile || 'tsconfig.json';
    const tsConfigFile = ts.findConfigFile(
        opts.cwd,
        ts.sys.fileExists,
        configPath,
    );
    if (!tsConfigFile) {
        throw new Error(
            `${tsConfigFile} not found in the current directory! ${opts.cwd}`,
        );
    }
    const configFile = ts.readConfigFile(tsConfigFile, ts.sys.readFile);
    const tsConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        opts.cwd,
    );
    return { tsConfig, tsConfigFile };
}

async function build() {
    const outDir = join(rootDir, 'dist')
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(join(rootDir, 'dist'))
    }
    const entries = [
        'core', 'common'
    ]
    await buildTypes(entries)
    await Promise.all(entries.map(buildEntry))
}

build().catch((e) => {
    console.error(e);
    process.exit(0);
});
