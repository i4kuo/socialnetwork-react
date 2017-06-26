var express = require('express'), router = express.Router();
const db = require('../config/database');
const auth = require('../config/authentification');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');



const multer = require('multer');


var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.resolve(__dirname, '../public/uploads'));
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



router.route('/myProfile')

    .get( (req, res) => {
        db.getUserInfo(req.session.user.id)

        .then(function(results){
            let { last_name, first_name, image, bio, id} = results;
            res.json({ last_name, first_name, image, bio, id })
        })

        .catch(function(err){
            console.log(err);
        })

    });



router.route('/uploadImageFromReactBeforeConfirm')

    .post(uploader.single('file'), (req, res) => {
        console.log("here!!!!!!");
        res.json({
            success : true,
            file : "/uploads/" + req.file.filename
        })
    });



router.route('/uploadImageFromReact')

    .post(  uploader.single('file'), (req, res) => {

        var fileName = "/uploads/" + req.file.filename;
        var userId = req.session.user.id;

        if (req.file) {

            db.updateImage(userId, fileName)

            .then(function(results){
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




router.route('/updatingBio')

    .post( (req, res) => {

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
    });





module.exports = router;
