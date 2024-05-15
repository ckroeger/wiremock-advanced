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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});