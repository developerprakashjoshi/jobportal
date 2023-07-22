import { Request, Response } from "express";
export default class Server{
    constructor(){
       console.log("Hello") 
    }
    static async remoteAddr(req: Request) {
        let ip: string | string[] | undefined = req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
    
        if (typeof ip === 'string') {
          ip = ip.split(',')[0];
          ip = ip.split(':').slice(-1);
          return ip[0];
        }
    
        return undefined;
      }
}