const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.get('/ls', (req, res) => {
    const ls = spawn('ls', ['-lh', '/']);

    ls.stdout.pipe(res);
    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

app.get('/nm', (req, res) => {

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const nm = spawn('newman' , ['run','/home/newman/collections/mock-data-check.json'], { encoding: 'utf8' });
    //const nm = spawn('newman' , ['run','./collections/mock-data-check.json'], { encoding: 'utf8' });

    nm.stdout.pipe(res);
    nm.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    nm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

/*
app.get('/pm', (req, res) => {
    const newman = require('newman');

    newman.run({
        collection: require('./collections/mock-data-check.json'),
        reporters: 'cli'
    })
    .on('start', function () {
        res.write('starting\n');
    })
    .on('done', function (err, summary) {
        if (err || summary.error) {
            res.write('An error occurred during the run\n');
            res.status(500).end();
        } else {
            res.write('Collection run complete!\n');
            res.end();
        }
    })
    .on('request', function (err, args) {
        if (err) {
            res.write(`Error: ${err}\n`);
        } else {
            res.write(args.response.stream);
        }
    });
});
*/

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});