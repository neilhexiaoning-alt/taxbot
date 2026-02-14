// Fix garbled comments in electron/main.cjs that swallow code on the same line
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '..', 'electron', 'main.cjs');

const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Detects code-like content: starts with identifier/keyword, or method calls, etc.
function looksLikeCode(s) {
  if (!s || s.length < 3) return false;
  // Starts with JS keyword, identifier assignment, method call, or brace
  return /^(const |let |var |function |if \(|else\b|return |for \(|while |switch |try |throw |new |mainWindow|tray|gatewayProcess|app\.|process\.)/.test(s);
}

// Check if a string contains mostly non-ASCII (garbled) characters
function isGarbled(s) {
  let nonAscii = 0;
  for (const ch of s) {
    if (ch.charCodeAt(0) > 127) nonAscii++;
  }
  return nonAscii > 5;
}

let fixCount = 0;
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trimStart();
  const indent = line.substring(0, line.length - trimmed.length);

  // Handle // comment lines
  if (trimmed.startsWith('//') && !trimmed.startsWith('// ====')) {
    const commentBody = trimmed.substring(2);
    // Find the last '?' that separates garbled text from code
    const qIdx = commentBody.lastIndexOf('?');
    if (qIdx > 0 && isGarbled(commentBody.substring(0, qIdx))) {
      const afterQ = commentBody.substring(qIdx + 1).trimStart();
      if (looksLikeCode(afterQ)) {
        const codePart = indent + afterQ;
        console.log(`Line ${i + 1}: splitting garbled comment from code`);
        console.log(`  Code: ${afterQ.substring(0, 80)}`);
        fixedLines.push(codePart);
        fixCount++;
        continue;
      }
    }
  }

  // Handle multi-line /** */ comment lines that also swallow code
  // Pattern: garbled text ending with ? followed by code, inside a comment block
  // These appear as:  * garbled?  some code
  // but they are actually NOT inside block comments since they got corrupted

  fixedLines.push(line);
}

const result = fixedLines.join('\n');
writeFileSync(filePath, result, 'utf8');
console.log(`\nFixed ${fixCount} lines. File saved.`);
