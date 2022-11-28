import * as express from "express"
import * as http from "http"
import * as WebSocket from "ws"
import { IAuth } from "./types/IAuth";
import { IConversationInit } from "./types/IConversationInit";
import { IConversationPackage } from "./types/IConversationPackage";
import { ConversationType } from "./types/typeEnums";
import * as jwt from 'jsonwebtoken'
import { IConversationJWTMessage } from "./types/IConversationJWTMessage";
import { IConversationMessage } from "./types/IConversationMessage";
import * as dotenv from 'dotenv'

dotenv.config()

const secret = process.env.SECRET!

const app = express();

app.use(express.json())

//This can all be deleted?
app.post('/auth', (req, res) => {
    const content: IAuth = req.body
    // Check against DB that user credentials are valid
    const token = jwt.sign({
        alias: content.username,
        color: "#FF0000",
        verified: true
    }, secret)
    res.send(token)
})

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients: Record<string, WebSocket> = {}

const sendToClient = (id: string, content: IConversationPackage) => {
    if (!(id in clients)) throw new Error("Client not found")
    const socket = clients[id];

    socket.send(JSON.stringify(content))
}

const broadCastToClients = (content: IConversationPackage) => {
    Object.values(clients).forEach(ws => ws.send(JSON.stringify(content)))
}

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected")
    const [, id] = Math.random().toString().split('.')
    clients[id] = ws;

    ws.on("message", (message: string) => {
        try {
            const data = JSON.parse(message.toString()) as IConversationPackage
            if (!("type" in data)) throw new Error("type is missing")
            switch (data.type) {
                case ConversationType.CONVERSATION:
                    broadCastToClients({ ...data, id })
                    break;
                case ConversationType.INITIATE:
                    break;
                case ConversationType.CONVERSATION_JWT:
                    try {
                        const { token, message } = data as IConversationJWTMessage;
                        const verified = jwt.verify(token, secret) as any;
                        console.log(verified);
                        broadCastToClients({
                            type: ConversationType.CONVERSATION,
                            alias: verified.alias,
                            color: verified.color,
                            message,
                            id,
                            verified: true,
                        } as IConversationMessage)
                    } catch {
                        console.log("Unverified");
                    }
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