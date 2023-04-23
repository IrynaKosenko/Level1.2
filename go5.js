const fs = require("fs");

let contentsExample1 = `GET /studentFile.txt HTTP/1.1 
Host: www.student.shpp.me.com
Accept: image/gif, image/jpeg, */* 
Accept-Language: en-us 

studentFile.txt`;

let contentsExample2 = `GET /anotherFile.txt HTTP/1.1 
Host: www.another.shpp.me.com
Accept: image/gif, image/jpeg, */* 
Accept-Language: en-us 

anotherFile.txt`;

function outputHttpResponse(statusCode, statusMessage, headers, body) {
    const response = `HTTP/1.1 ${statusCode} ${statusMessage}
${Object.keys(headers).map(k => k + ': ' + headers[k]).join('\n')}
   
${body}`;
    console.log(response);
}
function processHttpRequest($method, $uri, $headers, $body) {
    let statusCode, statusMessage, headers, body, dataFromFile;
    const server = 'Apache/2.2.14 (Win32)';
    const connection = 'Closed';
    const contentType = 'text/html; charset=utf-8';
    let path;
    if($headers['Host'].includes('student')){
        path = 'student';
    } else if($headers['Host'].includes('another')){
        path = 'another';
    } else {
        path = 'else';
    }

    try {
        console.log(fs.readFileSync(path + $uri, 'utf-8'));
        statusCode = 200;
        statusMessage = 'OK';
        body = $uri.substring(1);
    } catch (error) {
        statusCode = 404;
        statusMessage = 'File Not Found';
        body = 'file not found';
        //console.log(error);
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
    const method = /^\w+/.exec(string)[0];
    let uri = /(?<=\s)[^\s]+/.exec(string)[0];
    if (uri === '/') {
        uri = '/index.html';
    }
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
http = parseTcpStringAsHttpRequest(contentsExample1);
console.log(JSON.stringify(http, undefined, 2));
processHttpRequest(http.method, http.uri, http.headers, http.body);