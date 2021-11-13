import dotenv from "dotenv"
dotenv.config()

import cors from 'cors'
import http from 'http'
import fs from 'fs-extra'
import morgan from 'morgan'
import express from 'express'
import root from './routes/root'
import pods from './routes/pods'
import videos from './routes/videos'
import { Server } from 'socket.io'
import { favicon } from "./middlewares/favicon"
import mongoose, { ConnectOptions } from 'mongoose';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be defined!")
  if (process.env.MONGODB_TLS_CA) {
    fs.writeFileSync("./db.crt", process.env.MONGODB_TLS_CA)
  } else {
    throw new Error("MONGODB_TLS_CA must be defined!")
  }
  
  mongoose.connect(process.env.MONGODB_URI as string, {
    tls: true,
    tlsCAFile: './db.crt',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
}

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(favicon)

app.use('/', root)
app.use('/pods', pods)
app.use('/videos', videos)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on("join-room", (roomId, peerId, username) => {
    console.log(`${username} as ${peerId} joined room ${roomId}`)
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId, username);

    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.to(roomId).emit("user-disconnected", peerId);
    });

    // socket.on("message", (message) => {
    //   io.to(roomId).emit("createMessage", message, userName);
    // });
  });
});

export default server