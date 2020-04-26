const fs = require('fs')
const querystring = require('querystring')

for (let i = 0; i < 20; i++) {
  const rawText = fs.readFileSync(`l${i}.txt`, 'utf-8');
  
  const newText = querystring.unescape(rawText)
  fs.writeFileSync(`test/l${i}.txt`, newText)
}

// console.log(out)
