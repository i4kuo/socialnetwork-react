var express = require('express'), router = express.Router();
const db = require('../config/dbGeneral.js');
const auth = require('../config/auth.js');

router.route('/registerNewUser')

    .post( (req, res) => {
        db.checkIfUserExists(req.body).then(function(userInfo) {
            if (userInfo.rows[0]) {
                res.json({alreadyRegistered: true});
            } else {
                auth.hashPassword(req.body.pw).then(function(hash) {
                    var newUserInfo = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        hashedPw: hash,
                    };
                    db.addNewUserToDb(newUserInfo).then(function(result) {
                        if (result) {
                            req.session.user = {
                                userId: result.rows[0].id,
                                firstName: result.rows[0].first_name,
                                lastName: result.rows[0].last_name
                            };
                            res.json({success: true});
                        } else {
                            res.json({error: true});
                        }
                    }).catch(function(err) {
                        res.json({error: true});
                        console.log(err);
                    });
                }).catch(function(err) {
                    res.json({error: true});
                    console.log(err);
                });
            }
        }).catch(function(err) {
            res.json({error: true});
            console.log(err);
        });
    });

router.route('/userLogin')

    .post( (req, res) => {
        const userLoginInfo = req.body;
        db.checkIfUserExists(userLoginInfo).then(function(userInfo) {
            if (userInfo) {
                auth.checkPassword(userLoginInfo.pw, userInfo.rows[0].hashed_pw).then(function() {
                    req.session.user = {
                        userId: userInfo.rows[0].id,
                        firstName: userInfo.rows[0].first_name,
                        lastName: userInfo.rows[0].last_name
                    };
                    res.json({ success: true });
                }).catch(function(err) {
                    res.json({ error: true });
                    console.log(err);
                });
            } else {
                res.json({ noSuchUser: true });
            }
        }).catch(function(err) {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/userLogout')

    .get( (req, res) => {
        req.session = null;
        res.json({session: 'done'});
    });


module.exports = router;
