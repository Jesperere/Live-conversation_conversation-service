import * as express from "express"
import * as http from "http"
import * as WebSocket from "ws"
import { IConversationInit } from "./types/IConversationInit";
import { IConversationPackage } from "./types/IConversationPackage";
import { ConversationType } from "./types/typeEnums";

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients: Record<string, WebSocket> = {}

const sendToClient = (id: string, content: IConversationPackage) => {
    if (!(id in clients)) throw new Error("Client not found")
    const socket = clients[id];

    socket.send(JSON.stringify(content))
}

const broadCastToClinets = (content: IConversationPackage) => {
    Object.values(clients).forEach(ws => ws.send(JSON.stringify(content)))
}

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected")

    const [, id] = Math.random().toString().split('.')

    clients[id] = ws;

    ws.on("message", (message: string) => {
        try {

            const data = JSON.parse(message.toString()) as IConversationPackage
            console.log(data);
            if (!("type" in data)) throw new Error("type is missing")
            switch (data.type) {
                case ConversationType.CONVERSATION:
                    broadCastToClinets(data)
                    break;
                case ConversationType.INITIATE:
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);

        }
    });

    ws.on("close", function () {
        delete clients[id]
    })

    const initPackage: IConversationInit = {
        id,
        type: ConversationType.INITIATE
    }
    sendToClient(id, initPackage)


});

server.listen(process.env.PORT || 8999, () => {
    console.log("Server started!");
}); 