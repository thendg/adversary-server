import { Server, Socket } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true,
    })
)
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Mapping of users to their rooms. Socket IDs => game IDs.
const rooms = new Map();

function new_room(gameID, list_of_users) {
    for (let i = 0; i < list_of_users.length; i++) {
        rooms.set(list_of_users[i], gameID);
    }
}

function remove_room(gameID) {
    rooms.delete(gameID);
}

function get_room(user): string{
    return this.socket.id
}

io.on("connection", (socket) => {

    socket.on("new_room", function(data){
        socket.join("gameID");
    });

    socket.on("user_join", function(data) {
        this.username = data;
        socket.to(rooms.get(get_room(this))).emit("user_join", data);
    });

    socket.on("new_position", function(data) {
        data.username = this.username;
        socket.to(rooms.get(get_room(this))).emit("new_position", data);
    });

    socket.on("perk_activated", function(data) {
        data.username = this.username;
        socket.to(rooms.get(get_room(this))).emit("perk_activated", data);
    });
});

server.listen(port, function() {
    console.log("Listening on *:" + port);
});