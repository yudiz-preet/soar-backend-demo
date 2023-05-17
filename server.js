const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config()
const cors = require('cors');


const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Access-Control-Allow-Headers', 'Content-Type, Authorization'
  ]
}

const socketOptions = {
  pingInterval: 30000,
  pingTimeout: 15000,
  cookie: false,
  maxHttpBufferSize: 1024,
  serveClient: true,
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
  perMessageDeflate: false,
  cors: {
      origin: '*',
  },
};

const app = express();
app.use(cors(corsOpts));
const httpServer = createServer(app);
const io = new Server(httpServer, socketOptions);

io.on("connection", (socket) => {
  console.log({ socketId: socket?.id || '' })

  let data = [
    {
      name: "Chart-1",
      type: "line",
      data: [0, 15, 25, 20, 32, 27]
    },
    {
      name: "Chart-2",
      type: "line",
      data: [0, 32, 20, 40, 20, 30]
    },
    {
      name: "Chart-3",
      type: "line",
      data: [0, 38, 50, 10, 28, 43]
    }
  ]
  let labels = [0,1,2,3,4,5]
  setInterval(() => {
     data = data.map(item => {
        return {
            ...item,
            data: item.data.map((_, index) => {
                if(index === item.data.length - 1) {
                    return Math.floor(Math.random() * (50 - 0 + 1) + 0)
                } else {
                    return item.data[index + 1]
                }
            })
        }
     })
     labels = labels.map((item) => item + 1)
    socket.emit('testMessage', data, labels.map(item => item.toString()))
  }, 5000)

  socket.on("disconnect", (reason) => {
    console.log('disconnect connection from server ', reason)
  });

});

httpServer.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} PORT listening....`)
});