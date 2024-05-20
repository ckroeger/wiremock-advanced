const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.get('/ls', (req, res) => {
    const ls = spawn('ls', ['-lh', '/']);

    ls.stdout.pipe(res);
    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    ls.on('error', (err) => {
        console.error(`Error executing ls command: ${err}`);
        res.status(500).send('Internal Server Error');
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.status(500).send(`child process exited with code ${code}`);
    });
});

app.get('/collections', (req, res) => {
    const collectionsDir = path.join('/home/newman/', 'collections');
    fs.readdir(collectionsDir, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            res.status(500).send('Internal Server Error');
        } else {
            const jsonFiles = files.filter(file => path.extname(file) === '.json').sort();
            res.json(jsonFiles);
        }
    });
});

app.get('/', (req, res) => {

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const nm = spawn('newman' , ['run','/home/newman/collections/mock-data-check.json'], { encoding: 'utf8' });
    //const nm = spawn('newman' , ['run','./collections/mock-data-check.json'], { encoding: 'utf8' });

    nm.stdout.pipe(res);
    nm.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send(`data: child process exited with code ${data}`);
    });

    nm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.status(500).send(`close: child process exited with code ${code}`);
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});