const fs = require('fs');
const path = require('path');

const coverageDir = './coverage';

const sources = [];
const malformedSources = [];

fs.readdirSync(coverageDir).forEach((fileName) => {
  const coverage = JSON.parse(fs.readFileSync(path.resolve(coverageDir, fileName), 'utf8'));
  const sourceMapCache = coverage['source-map-cache'];
  if (!sourceMapCache) return;
  Object.values(sourceMapCache)
    .flatMap((cache) => cache.data?.sources || [])
    .forEach((source) => {
      sources.push(source);
      if (/^file:\/\/\/[A-Z]:/.test(source)) return;
      malformedSources.push(source);
    });
});

console.log(`Found ${sources.length} sources in total:`, sources);

const malformedLength = malformedSources.length;
if (malformedLength > 0) {
  console.log(`${malformedLength} malformed:`, malformedSources);
  process.exitCode = 1;
}
