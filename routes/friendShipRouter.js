var express = require('express'), router = express.Router();
const db = require('../config/database');
const auth = require('../config/authentification');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const client = require('../config/s3');




router.route('/setFriendShipStatus')

    .post( (req, res) => {

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

    });




router.route('/getUserFriends')

    .get( (req, res) => {

        let friendShipconfirmed = [];
        let WaitingForAnwser = [];
        let friendShipToAccept = [];
        db.getUserFriends(req.session.user.id)
        .then((results)=>{

            results.forEach(function(result){
                var userUrl ="";
                result.image = `https://s3.amazonaws.com/social-net/${result.image}`;
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

    });







module.exports = router;
