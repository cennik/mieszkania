import * as socketio from "socket.io";
import { Mieszkanie } from "./types";

export default class WebApi {
    DATA:Map<string, Mieszkanie>;
    io: socketio.Server;
    constructor(DATA:Map<string, Mieszkanie>){
        this.DATA = DATA;
        this.io = new socketio.Server(12345, {
            cors: {
              origin: "http://localhost:3000",
              methods: ["GET", "POST"]
            }
        })
        this.io.on('connection', (client) => { 
            client.emit('allData', DATA);
        });
    }
}