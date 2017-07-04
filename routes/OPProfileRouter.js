var express = require('express'), router = express.Router();
const db = require('../config/database');
const auth = require('../config/authentification');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const client = require('../config/s3');



router.route('/OPProfile')

    .get((req, res) => {

        if (req.query.id == req.session.user.id) {
            return res.json({ redirect : true})
        }

        db.getUserInfo(req.query.id)
        .then(function(results){

            results.image = `https://s3.amazonaws.com/social-net/${results.image}`;
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
    });





router.route('/resultsSearchInput')

    .get((req, res) => {

        if (!req.query.query) {
            return res.json({
                message : "Please enter something",
                results : false
            })
        }

        db.checkSearchInput(req.query.query)
        .then(function(results){
            results.forEach(function(user){
                user.image = `https://s3.amazonaws.com/social-net/${user.image}`;
                var userUrl = "";
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
    });



module.exports = router;
