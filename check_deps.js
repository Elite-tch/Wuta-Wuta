const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = new Set([...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})]);

const builtinModules = new Set(['fs', 'path', 'os', 'http', 'https', 'crypto', 'stream', 'util', 'events', 'url', 'querystring', 'zlib', 'buffer']);

function getImports(dir) {
  const files = fs.readdirSync(dir);
  let imports = new Set();

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== 'build' && file !== '.git') {
        getImports(filePath).forEach(imp => imports.add(imp));
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.matchAll(/(?:import|from)\s+['"](@?[^'"]+)['"]/g);
      for (const match of matches) {
        let pkg = match[1];
        if (pkg.startsWith('.')) continue;
        if (pkg.includes('/')) {
            if (pkg.startsWith('@')) {
                pkg = pkg.split('/').slice(0, 2).join('/');
            } else {
                pkg = pkg.split('/')[0];
            }
        }
        imports.add(pkg);
      }
    }
  });

  return imports;
}

const allImports = getImports('src');
const missing = [];

allImports.forEach(imp => {
  if (!dependencies.has(imp) && !builtinModules.has(imp)) {
    missing.push(imp);
  }
});

console.log('Missing dependencies:', missing);
