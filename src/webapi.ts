import { Set } from "json-set-map";
import * as socketio from "socket.io";
import { Mieszkanie, mieszkanieFormat } from "./types";

export default class WebApi {
    DATA: Map<string, Mieszkanie>;
    io: socketio.Server;
    constructor(DATA: Map<string, Mieszkanie>) {
        this.DATA = DATA;
        this.io = new socketio.Server(3001, {
            cors: {
                origin: '*',
            }
        });
        this.io.on('connection', (client) => {
            client.emit('allData', DATA);
            client.on('update', (entry: Mieszkanie) => this.updateEntry(entry));
        });
    }
    updateEntry(entry: Mieszkanie) {
        mieszkanieFormat(entry);
        this.DATA.set(entry.url, entry);
        this.io.emit('update', entry);
    }
    addEntry(entry: Mieszkanie) {
        mieszkanieFormat(entry);
        this.DATA.set(entry.url, entry);
        this.io.emit('add', entry);
    }
}