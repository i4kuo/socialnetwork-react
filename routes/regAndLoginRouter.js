var express = require('express'), router = express.Router();
const db = require('../config/database');
const auth = require('../config/authentification');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


router.route('/logInUser')

    .post( (req, res) => {
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
            .catch(function(err){
                console.log(err);
            })
        })
        .catch(function(err){
            res.redirect('/login');
        })
    });


router.route('/registerUser')

    .post( (req, res) => {

        var firstName = req.body.first;
        var lastName = req.body.last;
        var email = req.body.email;
        var plainTextPassword = req.body.password;
        var image = "default-user.png"

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
                db.registerUser(firstName, lastName, email, hashedPassword, image)

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
    });



router.route('/logInUser')

    .post( (req, res) => {

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

    });





router.route('/registerUser')

    .post( (req, res) => {
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



module.exports = router;
