var express = require('express'), router = express.Router();
const db = require('../config/database');
const auth = require('../config/authentification');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
//const client = require('../config/s3');
const s3 = require('../config/s3');



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
            results.image = `https://s3.amazonaws.com/social-net/${results.image}`;
            let { last_name, first_name, image, bio, id} = results;
            res.json({ last_name, first_name, image, bio, id })
        })

        .catch(function(err){
            console.log(err);
        })

    });


let imageNameToStoreInTheDatabase;


router.route('/uploadImageFromReactBeforeConfirm')

    .post(uploader.single('file'), s3.toS3, (req, res) => {
        imageNameToStoreInTheDatabase = req.file.filename
        res.json({
            success : true,
            file : `https://s3.amazonaws.com/social-net/${req.file.filename}`
        })
    });


router.route('/uploadImageFromReact')

    .post(  uploader.single('file'), (req, res) => {
        var fileName = imageNameToStoreInTheDatabase;
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
