import { IConversationMessage } from "./IConversationMessage";

export interface IConversationJWTMessage extends IConversationMessage {
    token: string;
}