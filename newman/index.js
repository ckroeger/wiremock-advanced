const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const colPath = '/home/newman/collections';

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

app.get('/run/:collectionName', (req, res) => {
    const collectionName = req.params.collectionName;
    if (!collectionName) {
        res.status(400).send('Missing collection name');
        return;
    }
    const location = `${colPath}/${collectionName}`;
    fs.access(location, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${collectionName}`);
            res.status(404).send(`Collection ${collectionName} not found`);
        } else {
            runNewmanWith(res, location);
        }
    });
});

app.get('/', (req, res) => {
    runNewmanWith(res, `${colPath}/mock-data-check.json`);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

function runNewmanWith(res, location) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const controller = new AbortController();
    try {
        const { signal } = controller;
        const nm = spawn('newman', ['run', location], { 
            encoding: 'utf8',
            signal
        });
        nm.stdout.pipe(res);
        nm.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            res.write(`\nError: child process exited with code ${data}\n`);
            //controller.abort();
        });

        nm.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                res.write('\nSuccess: The process completed successfully!\n');
            } else {
                res.write(`\nClose: child process exited with code ${code}\n`);
            }
            controller.abort();
        });

        nm.on('error', (err) => {
            console.error(`spawn error: ${err}`);
            res.write(`\nspawn Error: ${err}\n`);
        });
    } catch (err) {
        console.error(`Error running Newman: ${err}`);
        res.write('Internal Server Error');
        controller.abort();
    }
}