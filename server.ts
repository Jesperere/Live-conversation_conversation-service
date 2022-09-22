import * as express from "express"
import * as http from "http"
import * as WebSocket from "ws"

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
        console.log("recieved: %s", message)
        ws.send(`Hello, you sent ->  ${message}`)
    });

    ws.send("Hi, im a websocket server");
});

server.listen(process.env.PORT || 8999, () => {
    console.log("Server started!");
}); 