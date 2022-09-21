"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("recieved: %s", message);
        ws.send(`Hello, you sent ->  ${message}`);
    });
    ws.send("Hi, im a websocket server");
});
server.listen(process.env.PORT || 8999, () => {
    console.log("Server started!");
});
//# sourceMappingURL=server.js.map