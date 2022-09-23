import * as express from "express"
import * as http from "http"
import * as WebSocket from "ws"

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected")
    ws.on("message", (message: string) => {
        console.log("recieved: %s", message)

        wss.clients.forEach(function each(client){
            client.send("User sent: " + message.toString())            
        })
    });
    
       ws.send("Hi, im a websocket server");

   ws.on("close", function () {
        console.log("Client disconnected")
   })
});

server.listen(process.env.PORT || 8999, () => {
    console.log("Server started!");
}); 