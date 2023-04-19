const fs = require("fs");
const path = "passwords.txt";

// function readHttpLikeInput() {
//     //var fs = require("fs");
//     var res = "";
//     var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
//     let was10 = 0;
//     for (; ;) {
//         try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) { break; /* windows */ }
//         if (buffer[0] === 10 || buffer[0] === 13) {
//             if (was10 > 10)
//                 break;
//             was10++;
//         } else
//             was10 = 0;
//         res += new String(buffer);
//     }

//     return res;
// }

// let contents = readHttpLikeInput();

let contentsExample = `POST /api/checkLoginAndPassword HTTP/1.1
Accept: */*
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/4.0
Content-Length: 35

login=student&password=12345`;

function outputHttpResponse(statusCode, statusMessage, headers, body) {
    // ...
    const response = `HTTP/1.1 ${statusCode} ${statusMessage}
${Object.keys(headers).map(k => k + ': ' + headers[k]).join('\n')}
   
${body}`;
    console.log(response);
}
function processHttpRequest($method, $uri, $headers, $body) {
    // ... проанализировать входящие данные, вычислить результат
    // и специальной командой красиво вывести ответ
    let statusCode, statusMessage, headers, body, dataFromFile;
    const server = 'Apache/2.2.14 (Win32)';
    const connection = 'Closed';
    const contentType = 'text/html; charset=utf-8';

    if ($uri !== '/api/checkLoginAndPassword') {
        statusCode = 400;
        statusMessage = 'Not Found';
        body = 'not found';
    }
    let infoFromBody = $body.match(/(?<=\=)\w+/gi).join(':');

    try {
        dataFromFile = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
        if (dataFromFile.includes(infoFromBody)) {
            statusCode = 200;
            statusMessage = 'OK';
            body = '<h1 style="color:green">FOUND</h1>';
        } else {
            statusCode = 400;
            statusMessage = 'Not Found';
            body = 'login or parol not found';
        }
    } catch (error) {
        console.error(error);
        statusCode = 500;
        statusMessage = 'Internal Server Error';
        body = 'internal server error';
    }
    headers = {
        Server: server,
        'Content-Length': body.toString().length,
        Connection: connection,
        'Content-Type': contentType,
    }
    outputHttpResponse(statusCode, statusMessage, headers, body);
}

function parseTcpStringAsHttpRequest(string) {
    // ну это вы уже написали
    const method = /^\w+/.exec(string)[0];
    const uri = /(?<=\s)[^\s]+/.exec(string)[0];
    let body = (/(?<=\n\n).*/.exec(string) !== null) ? (/(?<=\n\n).*/.exec(string)[0]) : "";
    let head = string.match(/(?<=\n)[\w\-]*\:.*/g);
    let headers;
    if (head !== null) {
        headers = head.map(el => el.split(':'))
            .reduce((ac, cur) => {
                return { ...ac, [cur[0].toLowerCase().replace(/^[a-z]|(\-[a-z])/g, e => e.toUpperCase())]: cur[1].trimStart() }
            }, {});
    } else {
        headers = {};
    }

    return {
        method,
        uri,
        headers,
        body,
    };
}

//http1 = parseTcpStringAsHttpRequest(contents);
http2 = parseTcpStringAsHttpRequest(contentsExample);
console.log(JSON.stringify(http2, undefined, 2));
//processHttpRequest(http1.method, http1.uri, http1.headers, http1.body);
processHttpRequest(http2.method, http2.uri, http2.headers, http2.body);
