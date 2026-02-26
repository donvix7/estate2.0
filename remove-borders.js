const fs = require('fs');

function removeBordersSafely(filePath) {
  let code;
  try {
    code = fs.readFileSync(filePath, 'utf8');
  } catch(e) {
    console.log("Could not read " + filePath);
    return;
  }

  // Regex to match tailwind border classes cleanly
  const borderRegex = /\b(?:hover:|focus:|active:|lg:|md:|sm:)?(?:border|border-(?:[trblxy])|border-(?:0|2|4|8)|border-(?:dashed|dotted|double|hidden|none)|border-(?:transparent|white|black|gray|red|yellow|green|blue|indigo|purple|pink)(?:-\d{2,3})?(?:\/\d{2})?)\b/g;

  let newCode = code.replace(borderRegex, '');
  
  // Clean up multiple spaces
  newCode = newCode.replace(/ +class/g, ' class');
  newCode = newCode.replace(/className=\" +/g, 'className=\"');
  newCode = newCode.replace(/ +\"/g, '\"');
  newCode = newCode.replace(/ +'`/g, '\'`');
  newCode = newCode.replace(/ +'/g, '\'');
  newCode = newCode.replace(/ +}/g, '}');

  if(newCode !== code) {
    fs.writeFileSync(filePath, newCode);
    console.log('Removed borders from ' + filePath);
  } else {
    console.log('No matches found in ' + filePath);
  }
}

removeBordersSafely('app/page.js');
removeBordersSafely('app/mobile/page.jsx');
