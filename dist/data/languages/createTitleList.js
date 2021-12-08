const fs = require('fs');

const out = [];
for (let i = 0; i < 20; i++) {
  const raw = fs.readFileSync(`l${i}.txt`, 'utf-8')
  const split = raw.split('\n');


  out.push(split[619]);

}

console.log(out)
