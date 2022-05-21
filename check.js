const fs = require('fs');
const path = require('path');

const coverageDir = './coverage';

let sourceCount = 0;
const malformedSourceList = [];

fs.readdirSync(coverageDir).forEach((fileName) => {
  const coverage = JSON.parse(fs.readFileSync(path.resolve(coverageDir, fileName), 'utf8'));
  const sourceMapCache = coverage['source-map-cache'];
  if (!sourceMapCache) return;
  const sources = Object.values(sourceMapCache).flatMap((payload) => payload.data?.sources || []);
  sourceCount += sources.length;
  sources.forEach((source) => {
    if (/^file:\/\/\/[A-Z]/.test(source)) return;
    malformedSourceList.push(source);
  });
});

console.log(`Found ${sourceCount} sources in total.`);

const malformedLength = malformedSourceList.length;
if (malformedLength > 0) {
  console.log(`${malformedLength} malformed:`, malformedSourceList);
  process.exitCode = 1;
}
