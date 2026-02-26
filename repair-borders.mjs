import fs from 'fs';
import { execSync } from 'child_process';

const files = execSync('git ls-files --cached --others --exclude-standard | grep -E "\\.jsx?$"').toString().split('\n').filter(Boolean);

let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Fix cases like "   -gray-300" -> " border-gray-300"
  content = content.replace(/(\s)-([a-z]+-\d{2,3}(?:\/\d{2,4})?)\b/g, '$1border-$2');
  
  // Fix cases like "focus: -blue-500" or "dark: -gray-700" 
  content = content.replace(/([a-z]+:)\s*-([a-z]+-\d{2,3}(?:\/\d{2,4})?)\b/g, '$1border-$2');
  
  // Fix cases like " -dashed" 
  content = content.replace(/(\s)-(dashed|dotted|double|hidden|none|transparent|white|black)\b/g, '$1border-$2');
  content = content.replace(/([a-z]+:)\s*-(dashed|dotted|double|hidden|none|transparent|white|black)\b/g, '$1border-$2');

  // Fix cases like " -t" or " -b-2"
  content = content.replace(/(\s)-([btrlyx])(?:-(\d))?\b/g, (match, prefix, dir, num) => {
    return num ? `${prefix}border-${dir}-${num}` : `${prefix}border-${dir}`;
  });
  content = content.replace(/([a-z]+:)\s*-([btrlyx])(?:-(\d))?\b/g, (match, prefix, dir, num) => {
    return num ? `${prefix}border-${dir}-${num}` : `${prefix}border-${dir}`;
  });
  
  // Fix " -0", " -2", " -4", " -8"
  content = content.replace(/(\s)-(0|2|4|8)\b/g, '$1border-$2');
  content = content.replace(/([a-z]+:)\s*-(0|2|4|8)\b/g, '$1border-$2');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Repaired borders in ${file}`);
    totalChanged++;
  }
});

console.log(`Total files repaired: ${totalChanged}`);
