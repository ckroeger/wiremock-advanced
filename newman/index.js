const express = require('express');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

const rootPath = './';
const colPath = rootPath + 'collections';

app.use(cors());

app.get('/nm/echo', (req, res) => {
    res.contentType('text/plain').send('Echo from Newman-Backend');
});

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
    const collectionsDir = path.join(rootPath, 'collections');
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
    const asJson = req.query.asJson === 'true'; // Check if asJson parameter is present and set to true
    if (!collectionName) {
        res.status(400).send('Missing collection name');
        return;
    }
    const location = `${colPath}/${collectionName}`;
    fs.access(location, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${location}: ${err}`);
            res.status(404).send(`Collection ${collectionName} not found`);
        } else {
            if (asJson) {
                runNewmanWithJson(res, location, 'cli,json');
            } else {
                runNewmanWith(res, location, 'cli');
            }
        }
    });
});

function runNewmanWithJson(res, location, reporters) {
    if (reporters === 'cli') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    } else {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    const nm = spawn('newman', [
        'run', location,
        '--reporters', reporters,
        '--reporter-json-export', rootPath + 'jsonReport.json'
    ], {encoding: 'utf8'});

    nm.stdout.on('data', (data) => {
        if (reporters === 'cli') {
            res.write(data);
        }
    });

    nm.stdout.on('end', () => {
        nm.on('close', (code) => {
            //console.log(`child process exited with code ${code}`);
            if (reporters === 'cli') {
                if (code === 0) {
                    res.write('\n✅ Success: Collection run completed successfully!\n');
                } else {
                    res.write(`\n❌ Fail: Collection run failed.\n`);
                }
            } else {
                fs.readFile(rootPath + 'jsonReport.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading jsonReport.json: ${err}`);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.write(data);
                        res.end();
                    }
                });
            }
        });
    });
    nm.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        //res.write(`\nError: child process exited with code ${data}\n`);
    });
    nm.on('error', (err) => {
        console.error(`spawn error: ${err}`);
        res.status(500).send(`spawn Error: ${err}`);
    });
}

app.get('/', (req, res) => {
    runNewmanWith(res, `${colPath}/mock-data-check.json`);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

function runNewmanWith(res, location) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const nm = spawn('newman', ['run', location], {encoding: 'utf8'});

    nm.stdout.on('data', (data) => {
        res.write(data);
    });

    nm.stdout.on('end', () => {
        nm.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                res.write('\n✅ Success: Collection run completed successfully!\n');
            } else {
                res.write(`\n❌ Fail: Collection run failed.\n`);
            }
            res.end();
        });
    });

    nm.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        //res.write(`\nError: child process exited with code ${data}\n`);
    });

    nm.on('error', (err) => {
        console.error(`spawn error: ${err}`);
        res.write(`\nspawn Error: ${err}\n`);
    });
}