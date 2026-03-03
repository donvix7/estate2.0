import fs from 'fs';

function fixSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix missing '>' on closing tags: </div, </button, </span, etc. that do not have >
  content = content.replace(/<\/(div|button|span|h[1-6]|p|section|main|nav|header|footer)(?![>|a-zA-Z0-9])/g, '</$1>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed syntax in ${filePath}`);
}

fixSyntax('app/page.js');
fixSyntax('app/mobile/page.jsx');
