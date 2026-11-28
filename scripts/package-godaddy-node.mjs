// Packages the site as a ready-to-run Node.js app for GoDaddy cPanel "Setup Node.js App".
//
//   node scripts/package-godaddy-node.mjs [target-folder]
//
// Default target: ../brandtom-website-godaddy (next to this project). Result:
//   <target>/brandtom-node-app/        the app folder (Application root on GoDaddy)
//     app.js                           startup file for cPanel / Passenger
//     package.json                     minimal, no dependencies to install
//     server/                          Next.js standalone server + its node_modules
//   <target>/brandtom-node-app.zip     the same folder zipped, for File Manager upload
//
// The server lives in server/ because cPanel's Node.js selector refuses an app whose
// root folder already contains node_modules (it manages that folder itself).
// Uses `node` directly rather than npm/npx, which break on folder names containing "&".

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || path.join(project, '..', 'brandtom-website-godaddy'));
const appName = 'brandtom-node-app';
const appDir = path.join(target, appName);
const serverDir = path.join(appDir, 'server');
const standalone = path.join(project, '.next', 'standalone');

console.log('Building Next.js standalone server...');
const build = spawnSync(process.execPath, [path.join(project, 'node_modules/next/dist/bin/next'), 'build'], {
    cwd: project,
    stdio: 'inherit',
    env: { ...process.env, GODADDY_NODE: '1', NEXT_TELEMETRY_DISABLED: '1' },
});
if (build.status !== 0) process.exit(build.status ?? 1);
if (!existsSync(path.join(standalone, 'server.js'))) {
    console.error('Build did not produce .next/standalone/server.js');
    process.exit(1);
}

// Fresh app folder (emptied rather than deleted, so it works while open in Explorer)
mkdirSync(appDir, { recursive: true });
for (const entry of readdirSync(appDir)) rmSync(path.join(appDir, entry), { recursive: true, force: true });

// Standalone server, plus the static assets and public files it does not copy itself
cpSync(standalone, serverDir, { recursive: true });
cpSync(path.join(project, '.next', 'static'), path.join(serverDir, '.next', 'static'), { recursive: true });
cpSync(path.join(project, 'public'), path.join(serverDir, 'public'), { recursive: true });

writeFileSync(path.join(appDir, 'app.js'), `// Startup file for GoDaddy cPanel "Setup Node.js App" (Phusion Passenger).
// The Next.js server and its dependencies live in ./server, because cPanel's Node.js
// selector does not allow a node_modules folder in the application root.
const path = require('path');

process.env.NODE_ENV = 'production';
// Linux shells set HOSTNAME to the machine name; Next.js would try to bind to it.
process.env.HOSTNAME = '0.0.0.0';

process.chdir(path.join(__dirname, 'server'));
require('./server/server.js');
`);

writeFileSync(path.join(appDir, 'package.json'), JSON.stringify({
    name: 'brandtom-brandter-website',
    version: '1.0.0',
    private: true,
    description: 'Brandtom & Brandter website (Next.js standalone server)',
    main: 'app.js',
    scripts: { start: 'node app.js' },
    engines: { node: '>=20.9.0' },
}, null, 2) + '\n');

// Zip the app folder itself, so extracting creates brandtom-node-app/.
// Use Windows' own tar.exe explicitly: a Git-for-Windows `tar` on PATH cannot write zips.
const zipPath = path.join(target, `${appName}.zip`);
rmSync(zipPath, { force: true });
const winTar = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe');
const tarCmd = process.platform === 'win32' && existsSync(winTar) ? winTar : 'tar';
const zip = spawnSync(tarCmd, ['-a', '-c', '-f', zipPath, '-C', target, appName], { stdio: 'inherit' });
if (zip.status !== 0) console.warn(`Could not create the zip; upload the ${appName} folder instead.`);

console.log(`\nReady for GoDaddy:\n  app folder: ${appDir}\n  zip:        ${zipPath}\n  startup:    app.js`);
