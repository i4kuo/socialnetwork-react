var bcrypt = require('bcryptjs');

function hashPassword(plainTextPassword, callback) {
    return new Promise(function(resolve, reject){
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return callback(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return callback(err);
                }
                callback(null, hash);
            });
        });
    })
}


function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase, callback) {
    return new Promise(function(resolve, reject){
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                return callback(err);
            }
            callback(null, doesMatch);
        });
    })
};


module.exports.hashPassword = hashPassword;
module.exports.checkPassword = checkPassword;
