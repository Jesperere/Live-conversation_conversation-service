import { IConversationPackage } from "./IConversationPackage";

export interface IConversationMessage extends IConversationPackage {
    alias: string;
    color: string;
    message: string;
    verified?: boolean;
}