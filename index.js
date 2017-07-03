const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config/database');
const auth = require('./config/authentification');
const multer = require('multer');
var csurf = require('csurf');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const knox = require('knox');



let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'social-net'
});



let onlineUsers = [];
let messagesStored = [];

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

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

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('t', req.csrfToken());
    next();
})




if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

app.use(express.static(__dirname + `/public`));





app.post('/logInUser', (req,res) => {
    var email = req.body.email ;
    var password = req.body.password;

    db.login(email)

    .then(function(results){

        if (!results) {
            res.json({
                success : false,
                message : "This email adress doesn't exist !"
            })
        }
        var userProfileObject = results
        var hashedPassword = results.password;
        auth.checkPassword(password, hashedPassword, function(err, doesMatch){
            if(err != null){

                res.json({
                    success : false,
                    message : "sdfjkhsdkf"
                })
            }else {
                req.session.user = results;

                if (doesMatch) {

                    res.json({
                        success : true,
                    })

                }else {

                    res.json({
                        success : false,
                        message : "You entered wrong password!"
                    })
                }
            }
        })
    })

    .catch(function(err){
        res.redirect('/login');
    })

})



app.post('/registerUser', (req, res) => {

    var firstName = req.body.first;
    var lastName = req.body.last;
    var email = req.body.email;
    var plainTextPassword = req.body.password;

    if (plainTextPassword.length < 5){
        return res.json({
            success : false,
            message : "please choose a password longer than 5 characters."

        })
    }

    auth.hashPassword(plainTextPassword, function(err, hashedPassword){

        if(err != null){
            console.log(err)
            return;
        }else {
            db.registerUser(firstName, lastName, email, hashedPassword)

            .then(function(results){
                req.session.user = results.rows[0];

                res.json({
                    success : true,
                    file : results
                })
            })

            .catch(function(err){
                console.log(err);
                res.json({
                    success : false,
                    message : "This email already exist, you wanna Log in ?"
                })
                console.log(err);
            });
        }
    })
})


app.get('/myProfile', (req, res) => {

    // HERE I WILL NEED knox get

    db.getUserInfo(req.session.user.id)

    .then(function(results){
        console.log("results!", results);
        if (!results.image) {
            results.image = "https://s3.amazonaws.com/social-net/default-user.png"
        }else {
        results.image = `https://s3.amazonaws.com/social-net/${results.image}`;
        }
        let { last_name, first_name, image, bio, id} = results;
        res.json({ last_name, first_name, image, bio, id })
    })

    .catch(function(err){
        console.log(err);
    })
})


function toS3(req, res, next){
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    const readStream = fs.createReadStream(req.file.path);
    console.log("path", req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        console.log("s3response",s3Response.statusCode);
        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            res.json({
                "err" : true
            })
        }
    })
}

app.post('/uploadImageFromReactBeforeConfirm', uploader.single('file'), toS3,  function(req, res) {
    res.json({
        success : true,
        file : `https://s3.amazonaws.com/social-net/${req.file.filename}`
    })
})

app.post('/uploadImageFromReact', uploader.single('file'), function(req, res) {
    // HERE knox PUT
    // var fileName = "/uploads/" + req.file.filename;
    var fileName = req.file.filename;
    var userId = req.session.user.id;


    if (req.file) {

        db.updateImage(userId, fileName)

        .then(function(results){
            results.image = `https://s3.amazonaws.com/social-net/${results.image}`;
            res.json({
                success : true,
                file : results.image
            })

        })

        .catch(function(e){
            console.log(e, "error!");
        })

    } else {
        res.json({
            success: false
        });
    }
});

app.post('/updatingBio', (req, res) => {
    let newBio = req.body.newBio;
    let userId = req.session.user.id;

    db.updateBio(userId, newBio)

    .then(function(results){
        res.json({
            success : true,
            bio : results.bio
        })

    })

    .catch(function(e){
        console.log(e, "error!");
    })
})


app.get('/resultsSearchInput', function(req, res){

    if (!req.query.query) {
        return res.json({
            message : "Please enter something",
            results : false
        })
    }

    db.checkSearchInput(req.query.query)
    .then(function(results){
        results.forEach(function(user){
            var userUrl = "";
            if (!user.image) {
                user.image = "https://s3.amazonaws.com/social-net/default-user.png"
            }else {
                user.image = `https://s3.amazonaws.com/social-net/${user.image}`
            }
            userUrl =  `user/${user.id}`;
            user["userUrl"] = userUrl;
        })
        return res.json({
            success : true,
            message : false,
            results
        })
    })
    .catch(function(err){
        console.log(err);
    })
})

app.get('/OPProfile', function(req, res){

    if (req.query.id == req.session.user.id) {
        return res.json({ redirect : true})
    }

    db.getUserInfo(req.query.id)
    .then(function(results){

        // knox GET ?

        if (!results.image) {
            results.image = "https://s3.amazonaws.com/social-net/default-user.png"
        }else {
            results.image = `https://s3.amazonaws.com/social-net/${results.image}`
        }

        let { last_name, first_name, image, bio, id} = results;

        db.getFriendshipStatus(req.query.id, req.session.user.id)
        .then(function (friendShipStatusResult){

            if (friendShipStatusResult) {

                if (friendShipStatusResult.status == "confirmed") {
                    return res.json({ success : true, last_name, first_name, image, bio, id, friendShipCreated : true })
                }else if (friendShipStatusResult.status == "terminated"){
                    return res.json({ success : true, last_name, first_name, image, bio, id, usersNotFriends : true, toUpdate : "true" })
                }else {
                    if (friendShipStatusResult.sender_id == req.session.user.id) {
                        return res.json({ success : true, last_name, first_name, image, bio, id, waitForConfirmation : true })
                    }else if(friendShipStatusResult.recipient_id == req.session.user.id){
                        return res.json({ success : true, last_name, first_name, image, bio, id, hasToConfirm : true })
                    }
                }
            } else{
                return res.json({success : true, last_name, first_name, image, bio, id, usersNotFriends : true })
            }

        })
        .catch(function(err){
            console.log(err);
        })
    })
    .catch(function(err){
        console.log(err);
        res.json({
            success : false,
            error: true,
            message : "This user doesn't exist !"
        })
    })
})


app.post('/setFriendShipStatus', (req, res) => {

    let friendShipStatus = req.query.friendShipStatus;
    let OPId = req.query.OPId;
    let userId = req.session.user.id;

    if(req.query.cancelFriendShip){
        db.cancelFriendRequest(userId, OPId)
        .then(function(results){
            res.json({

                success : true,
                usersNotFriends : true,
                waitForConfirmation : false,
                friendShipCreated : false,
                toUpdate : false

            })
        })
        .catch(function(err){
            console.log("error", err);
        })
    }
    else if (req.query.friendShipStatus == "pending" && req.query.toUpdate != "true") {

        db.CreateFriendShip(userId, OPId, friendShipStatus)
        .then(function(results){

            res.json({

                success : true,
                toUpdate : false,
                usersNotFriends : false,
                waitForConfirmation : true,
                friendShipCreated : false

            })
        })
        .catch(function(err){
            console.log(err);
        })
    }else if (req.query.friendShipStatus == "confirmed" || req.query.friendShipStatus == "terminated" ||  req.query.friendShipStatus == "pending") {;
        let friendShipStatus = req.query.friendShipStatus;
        db.UpdateFriendShip(userId, OPId, friendShipStatus)
        .then(function(results){
            if(results.status == "confirmed"){
                res.json({
                    success : true,
                    usersNotFriends : false,
                    waitForConfirmation : false,
                    toUpdate : false,
                    hasToConfirm : false,
                    friendShipCreated : true
                })
            }else if(results.status =="terminated"){
                res.json({
                    success : true,
                    usersNotFriends : true,
                    waitForConfirmation : false,
                    friendShipCreated : false,
                    toUpdate : "true"
                })
            }else if (results.status == "pending"){
                res.json({
                    success : true,
                    toUpdate : false,
                    usersNotFriends : false,
                    waitForConfirmation : true,
                    friendShipCreated : false
                })
            }
        })
    }


})

app.get('/getUserFriends', (req,res)=>{
    let friendShipconfirmed = [];
    let WaitingForAnwser = [];
    let friendShipToAccept = [];
    db.getUserFriends(req.session.user.id)
    .then((results)=>{

        results.forEach(function(result){
            // knox GET ?
            var userUrl ="";
            if (!result.image) {
                result.image = "https://s3.amazonaws.com/social-net/default-user.png"
            }else {
                result.image = `https://s3.amazonaws.com/social-net/${result.image}`
            }
            userUrl =  `user/${result.id}`
            result["userUrl"] = userUrl;
            if(result.status == "confirmed"){
                friendShipconfirmed.push(result)
            }else  if(result.status =="pending"){
                if (result.sender_id == req.session.user.id) {
                    WaitingForAnwser.push(result)

                }else {
                    friendShipToAccept.push(result)
                }
            }
        })
        res.json({
            friendShipconfirmed : friendShipconfirmed,
            WaitingForAnwser : WaitingForAnwser,
            friendShipToAccept : friendShipToAccept
        })
    }).catch((err)=> {
        console.log(err);
    })
})



app.post('/logout', (req, res) => {
    req.session.user = null;
    res.json({
        success : true
    })
})

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
        users.forEach(function(user){
            // knox GET ?
            if (!user.image) {
                user.image = "https://s3.amazonaws.com/social-net/default-user.png"
            }else {
                user.image = `https://s3.amazonaws.com/social-net/${user.image}`
            }
        })

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



server.listen(process.env.PORT || 8080, () => {
    console.log("I'm listening.")
});
