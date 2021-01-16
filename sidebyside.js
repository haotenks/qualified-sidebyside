const { kMaxLength } = require('buffer');
const fs = require('fs');
const readline = require('readline');

(function main() {
  const { s, c, filesPath } = getArgs(process.argv);
  let filesObjects = [];
  for (const idx in filesPath) {
    const file = readFile(filesPath[idx], s);
    const fixedFile = fixLinesWidth(file);
    filesObjects[idx] = fixedFile;
  }
  let maxSize = 0;
  for (const obj of filesObjects) {
    maxSize = Math.max(maxSize, obj.size);
  }
  
  const fullLines = [];
  for (let i = 0; i < maxSize; i++) {
    fullLines.push(createLine(i, filesObjects, c));
  };
  const result = fullLines.join('\n')
  console.log(fullLines);
  //console.log('\n');
  //console.log(result);
})();

function getArgs(args) {
  let s = -1;
  let c = 2;
  let filesPath = [];    
  for (let i=2; i<args.length; i++) {
    switch(args[i]){
      case "-s": s = args[++i]; break;
      case "-c": c = args[++i]; break;
      default: filesPath.push(args[i]); break;
    };
  };
  return { s, c, filesPath };
};

function readFile(url, s) {  
  let maxWidth = 0;
  let array = fs.readFileSync(url).toString().split('\n');  
  for (const i of array) {    
    const l = i.length;
    maxWidth = Math.max(maxWidth, l);    
  };  
  return { lines: array, maxWidth: s === -1 ? maxWidth : s };
};

function fixLinesWidth(file) {
  const { lines, maxWidth } = file;
  const result = [];
  for (const line of lines) {
    const lineLength = line.length;
    if (lineLength <= maxWidth) {
      result.push(line.padEnd(maxWidth, ' '));
      continue;
    }
    const chunks = createChunks(line, Number.parseInt(maxWidth));
    result.push(...chunks);
  }
  return { lines: result, maxWidth, size: result.length };
};

function createChunks(line, maxWidth) {
  const array = [];  
  for (let i = 0; i<line.length; i+=maxWidth) {    
    const temp = line.slice(i, i + maxWidth).padEnd(maxWidth, ' ');    
    array.push(temp);
  }
  return array;
};

function createLine(index, arrays, c) {
  const sep = ' '.repeat(c);
  const array = [];
  for (const l of arrays) {
    const lines = l.lines;
    const text = lines[index];
    if (text === undefined) {
      array.push(' '.padEnd(l.maxWidth));
      continue;
    }
    array.push(text);
  }
  return array.join(sep);
}
