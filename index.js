import { Server, Socket } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import cors from "cors";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});

const games = {};
const sockets = {};

io.on("connection", (socket) => {
    socket.on("join", ({gameID}) => {
        if (!games[gameID]) games[gameID] = [socket.id]
        else if (!games[gameID].includes(socket.id)) games[gameID].push(socket.id)
        sockets[socket.id] = socket
        console.log(`${socket.id} joined game ${gameID}`);
        console.log(games);
    })

    socket.on("request_position_update", (data) => {
        if (!games[data.gameID]) return
        games[data.gameID].forEach(playerID => {
            if (playerID == data.id) return;
            sockets[playerID].emit("position_update", {x: -data.data.x, y: data.data.y})
        });
        console.log("DATA:", data)
    })
});

server.listen(PORT, function() {
    console.log("Listening on *:" + PORT);
});