
const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');

let counter = 0;

app.get('/', (req, res) => {
  res.send('Hello World!!!!')
})

app.get('/hello', (req, res) => {
    try {
        counter = fs.readFileSync('test.txt', 'utf8');
        console.log(counter);
      } catch (err) {
        console.error(err);
      }
    counter++;

    res.send(`<h1 style="color:red">Кількість відвідувань сторінки - ${counter}<h1>`)

    try {
        fs.writeFileSync('test.txt', counter.toString());
        } catch (err) {
        console.error(err);
      }
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port} !!!`)
})