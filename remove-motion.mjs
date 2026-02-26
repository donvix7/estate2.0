import fs from 'fs';

const files = [
  'app/pricing/page.jsx',
  'app/login/page.jsx',
  'components/Hero.jsx',
  'app/register/page.jsx',
  'app/about/page.jsx',
  'app/mobile/page.jsx',
  'app/page.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove framer-motion imports
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]framer-motion['"];?\n?/g, '');

  // 2. Remove <AnimatePresence> and </AnimatePresence>
  content = content.replace(/<\/?AnimatePresence[^>]*>\n?/g, '');

  // 3. Replace <motion.TAG ...> with <TAG ...>
  content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
  content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');

  // 4. Remove purely motion-related props. They can span multiple lines!
  const propsToRemove = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'custom', 'layoutId', 'layout'];

  for (const prop of propsToRemove) {
    let startIndex = 0;
    
    // Find proper matches of the prop preceded by whitespace/newline
    while (true) {
      // Find matches like ` initial=` or `\ninitial=`
      const matchRegex = new RegExp(`(?:\\s|^)${prop}=`);
      const match = matchRegex.exec(content.substring(startIndex));
      
      if (!match) break;
      
      const absoluteMatchStart = startIndex + match.index;
      // The start of the actual prop text, preserving leading whitespace
      const matchStr = match[0];
      const propStart = absoluteMatchStart + matchStr.length - (prop.length + 1); // location of 'prop='

      const valStart = absoluteMatchStart + matchStr.length; // right after '='
      const firstChar = content.charAt(valStart - 1) === '=' ? content.charAt(valStart) : content.charAt(valStart + 1); 
      // wait, `valStart` is exactly right after `=`.
      
      let actualValStart = content.indexOf('=', absoluteMatchStart) + 1;
      let actualFirstChar = content.charAt(actualValStart);
      
      let endIndex = -1;
      
      if (actualFirstChar === '{') {
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = actualValStart; i < content.length; i++) {
          const char = content.charAt(i);
          if (inString) {
             if (char === stringChar && content.charAt(i-1) !== '\\') {
                 inString = false;
             }
          } else {
             if (char === '"' || char === "'" || char === "`") {
                 inString = true;
                 stringChar = char;
             } else if (char === '{') {
                 braceCount++;
             } else if (char === '}') {
                 braceCount--;
                 if (braceCount === 0) {
                     endIndex = i + 1;
                     break;
                 }
             }
          }
        }
      } else if (actualFirstChar === '"' || actualFirstChar === "'") {
         const closingQuote = content.indexOf(actualFirstChar, actualValStart + 1);
         if (closingQuote !== -1) {
            endIndex = closingQuote + 1;
         }
      }
      
      if (endIndex !== -1) {
         // remove the prop from right before the prop name, to the end index
         content = content.substring(0, propStart) + content.substring(endIndex);
      } else {
         startIndex = absoluteMatchStart + 1;
      }
    }
    
    // boolean prop like `layout`
    if (prop === 'layout') {
       content = content.replace(/\slayout\b(?!=)/g, '');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Script completed');
