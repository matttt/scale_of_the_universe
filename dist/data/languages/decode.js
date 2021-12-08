const fs = require('fs')
const querystring = require('querystring')
const colors = require('colors')

const mappings =
  [
    [ '%20', 'space' ],
    [ '%21', '!' ],
    [ '%22', '"' ],
    [ '%23', '#' ],
    [ '%24', '$' ],
    [ '%25', '%' ],
    [ '%26', '&' ],
    [ '%27', '\'' ],
    [ '%28', '(' ],
    [ '%29', ')' ],
    [ '%2A', '*' ],
    [ '%2B', '+' ]
  ];

function replacer(str) {
  let text = str;
  for (const map of mappings)
    text = text.replace(new RegExp(map[0], 'g'), map[1])

  return text;
}


for (let i = 0; i < 20; i++) {
  const rawText = fs.readFileSync(`test/l${i}.txt`, 'utf-8');

  // const newText = querystring.unescape(rawText)
  // console.log(rawText.red, newText.green)
  fs.writeFileSync(`out/l${i}.txt`, replacer(rawText))
}

// console.log(out)
