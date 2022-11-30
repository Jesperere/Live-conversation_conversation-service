export interface IEnv {
    SECRET: string;
}

// if(!process.env.SECRET) {
//     throw new Error("SECRET is required")
// }

export const environment = {
    SECRET: process.env.SECRET
} as IEnv