const express = require("express");
const app = express();
const port = 3000;

var expressWs = require("express-ws")(app);

//middleware function is now defined that will be executed for every request to the server.
app.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";
    //next middleware function in the chain is called
    return next();
});

//route handler function is defined for the root path of the server.
app.get("/", function (req, res, next) {
    console.log("get route", req.testing);
    res.end();
});

app.ws("/", function (ws, req) {
    //an event listener is set up for incoming WebSocket messages.
    ws.on("message", function (msg) {
        console.log(msg);
        ws.send(`pong: ${msg}`);
    });
    console.log("socket", req.testing);
});

//The server starts and listens on port 3000.
app.listen(4000, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});