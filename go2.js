// этот файл надо будет дописать...

// не обращайте на эту функцию внимания 
// она нужна для того чтобы правильно читать входные данные
function readHttpLikeInput() {
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for (; ;) {
    try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) { break; /* windows */ }
    if (buffer[0] === 10 || buffer[0] === 13) {
      if (was10 > 10)
        break;
      was10++;
    } else
      was10 = 0;
    res += new String(buffer);
  }

  return res;
}

let contents = readHttpLikeInput();

// вот эту функцию собственно надо написать

function parseTcpStringAsHttpRequest(string) {
  const method = /^\w+/.exec(string)[0];
  const uri =/(?<=\s)[^\s]+/.exec(string)[0];
  const body = /(?<=\n\n).*/.exec(string)[0];

  let head = string.match(/(?<=\n)[\w\-]*\:.*/g);
  const headers =head.map(el => el.split(':'))
  .reduce((ac,cur) => {
      return {...ac, [cur[0].toLowerCase().replace(/^[a-z]|(\-[a-z])/g, e => e.toUpperCase())]:cur[1].trimStart()}
  }, {});

  return {
    method,
    uri,
    headers,
    body,
  };
}

http = parseTcpStringAsHttpRequest(contents);
console.log(JSON.stringify(http, undefined, 2));