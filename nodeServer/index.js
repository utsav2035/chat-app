//node server handling socket io connections

const io = require("socket.io")(8000,{
    cors:{                                //for CORS error
        origin:'*',
    }
});

const users = {};

io.on("connection",socket =>{
    // if any new user joins,let others know
    socket.on("new-user-joined",name =>{
        //console.log(`${name} joined the chat`)
        users[socket.id] = name;
        socket.broadcast.emit("user-joined",name)
    });

    // if someone sends a message, broadcast it to other people
    socket.on("send", message =>{
        socket.broadcast.emit("receive",{message: message, name:users[socket.id]})
    });

    // if someone leaves , let others know
    socket.on("disconnect", message =>{
        socket.broadcast.emit("left",users[socket.id])
        delete users[socket.id];
    });
})