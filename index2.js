const express = require('express');
const app = express();
const db = require('./config/database');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');


let onlineUsers = [];
let messagesStored = [];

app.use(cookieSession({
    name: 'session',
    keys: ["this is my secret"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

// app.use('/uploads', express.static(__dirname + 'public//uploads'));
app.use(express.static(__dirname + `/public`));

// USER PROFILE :
app.use('/', require('./routes/userProfileRouter.js'));
app.use('/', require('./routes/OPProfileRouter.js'));
app.use('/', require('./routes/friendShipRouter.js'));
app.use('/', require('./routes/regAndLoginRouter.js'));


app.post('/logout', (req, res) => {
    req.session.user = null;
    res.json({
        success : true
    })
})



// SOCKETS!!!!


app.get('/connected/:socketId', function(req, res){
    if (req.session.user.id) {
        io.sockets.sockets[req.params.socketId] &&
        onlineUsers.push({
            socketId : req.params.socketId,
            userId: req.session.user.id
        })
        io.sockets.emit('OnlineUserChange', onlineUsers);
    }
})


app.get('/getOnlineUsers', function(req, res){
    var ids = onlineUsers.map(item => item.userId)
    var filteredIds = ids.filter((id, index) => {
        return ids.indexOf(id) == index;
    })
    db.getOnlineUsers(filteredIds)
    .then(users =>{
        res.json({
            users,
            success: true
        })
    })

})

app.get('/getMessages', function(req, res){
    if (messagesStored.length > 10) messagesStored = messagesStored.slice(messagesStored.length -10, messagesStored.length);
    res.json(messagesStored)
})

io.on('connection', function(socket) {
    console.log(onlineUsers, "online user connected!!");

    socket.on('disconnect', function() {
        onlineUsers = onlineUsers.filter(item => item.socketId !== socket.id)
        console.log(onlineUsers, "disconnected!");
        io.sockets.emit ('OnlineUserChange', onlineUsers);
    });

    socket.on('chat', function(data) {
        messagesStored.push(data)
        io.sockets.emit ('updateMessage', data);

    });
});





// WHERE LOGGED OUT

app.get('/welcome', (req, res) => {
    if(req.session.user){
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
});


// WHERE LOGGED IN
app.get('*', (req, res) => {
    if(!req.session.user){
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});


server.listen(8080, () => {
    console.log("I'm listening.")
});
