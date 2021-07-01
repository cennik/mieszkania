import { Set } from "json-set-map";
import * as socketio from "socket.io";
import { Mieszkanie } from "./types";

export default class WebApi {
    DATA: Map<string, Mieszkanie>;
    io: socketio.Server;
    constructor(DATA: Map<string, Mieszkanie>) {
        this.DATA = DATA;
        this.io = new socketio.Server(12345, {
            cors: {
                origin: "http://etiaro.tk:2137",
                methods: ["GET", "POST"]
            }
        })
        this.io.on('connection', (client) => {
            client.emit('allData', DATA);
            client.on('update', entry => this.updateEntry(entry));
        });
    }
    forceTypes(entry: Mieszkanie) {
        entry.keywords = new Set(entry.keywords)
    }
    updateEntry(entry: Mieszkanie) {
        this.forceTypes(entry);
        this.DATA.set(entry.url, entry);
        this.io.emit('update', entry);
    }
    addEntry(entry: Mieszkanie) {
        this.forceTypes(entry);
        this.DATA.set(entry.url, entry);
        this.io.emit('add', entry);
    }
}