import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, 'app/components');
const outputPath = path.resolve(__dirname, 'app/index.ts');

// Read all files in the components directory
const files = fs.readdirSync(componentsDir);

// Filter only .vue files
const componentFiles = files.filter(file => file.endsWith('.vue'));

// Generate export statements
const exportStatements = componentFiles.map(file => {
  const componentName = path.basename(file, '.vue');
  return `export { default as ${componentName} } from './components/${file}';`;
});

// Write the export statements to the index.ts file
fs.writeFileSync(outputPath, exportStatements.join('\n'), 'utf-8');
console.log(`Generated ${outputPath} with ${exportStatements.length} components.`);