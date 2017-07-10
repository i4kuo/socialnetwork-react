var spicedPg = require('spiced-pg');
var password = require('./password')

const PENDING = 1, ACCEPTED = 2, REJECTED = 3, TERMINATED = 4, CANCELED = 5;


// IS THAT OKAy ?
var dbUrl = process.env.DATABASE_URL ||`postgres:${password.id}:${password.password}@localhost:5432/reactsocialnetwork`;
var db = spicedPg(dbUrl);



function registerUser(firstName, lastName, email, password, image){
    return new Promise(function(resolve, reject){
        const q = `INSERT INTO users (first_name, last_name, email, password, image)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, first_name, last_name, email, image, bio;`
        ;

        if(password == ""){
            password = null;
        }

        const params = [firstName || null, lastName || null, email || null, password || null, image];
        return db.query(q, params).then(function(results){
            resolve(results)
        }).catch(function(e){
            reject(e);
        });
    })
};

function login(email){
    return new Promise(function(resolve, reject){
        const q = `SELECT * FROM users WHERE email =$1;`
        ;

        if(password == ""){
            password = null;
        }

        const params = [email || null];
        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })
}

function getUserInfo(id){

    const q = `SELECT *
    FROM users
    WHERE id =$1;`
    ;

    const params = [id];

    return db.query(q, params).then(function(results){
        if(!results.rows[0]){
            throw new Error;
        }
        return results.rows[0];
    })
}

function getFriendshipStatus(userId, OPId){

    return new Promise(function(resolve, reject){
        const q = `
        SELECT *
        FROM friend_request
        WHERE (sender_id = $1 OR recipient_id = $1)
        AND (sender_id = $2 OR recipient_id = $2);`
        ;

        const params = [userId, OPId];
        return db.query(q, params).then(function(results){

            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })
}

function updateImage(id , filename){
    return new Promise(function(resolve, reject){
        const q = `UPDATE users
        SET image = $2
        WHERE id =$1
        RETURNING *;`
        ;

        const params = [id, filename];
        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })

}

function updateBio(id , newBio){
    return new Promise(function(resolve, reject){
        const q = `UPDATE users
        SET bio = $2
        WHERE id =$1
        RETURNING *;`
        ;

        const params = [id, newBio];
        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })

}

function createFriendship(userId, OPId, status){
    return new Promise(function(resolve, reject){
        const query = `INSERT into friend_request (recipient_id, sender_id, status)
        VALUES ($1, $2, $3)
        RETURNING status;`

        const params = [userId, OPId, status]
        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })

}



function CreateFriendShip(userId, OPId, status){

    return new Promise(function(resolve, reject){
        const q = `INSERT INTO friend_request (sender_id,recipient_id , status)
        VALUES ($1, $2, $3)
        RETURNING *;`
        ;

        const params = [userId, OPId , status ];
        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        });
    })
};

function UpdateFriendShip(userId, OPId, status){
    return new Promise(function(resolve, reject){
        var oldstatus = ""
        if (status == "canceled" || status =="confirmed" || status =="rejected") {
            oldstatus = "pending"
        }else if(status == "terminated"){
            oldstatus = "confirmed"
        }else if (status == "pending"){
            oldstatus = "terminated"
        }

        const q = `UPDATE friend_request
        SET status = $3, sender_id =$1, recipient_id = $2
        WHERE (sender_id = $1 OR recipient_id = $1)
        AND (sender_id = $2 OR recipient_id = $2)
        AND status = $4
        RETURNING * ;`

        const params = [userId, OPId , status, oldstatus ];

        return db.query(q, params).then(function(results){
            resolve(results.rows[0]);
        }).catch(function(e){
            reject(e);
        })
    })

}

function getUserFriends(userId){
    return new Promise(function(resolve, reject){
        const q = `SELECT users.id, first_name, last_name, image, friend_request.status,friend_request.sender_id, friend_request.recipient_id
        FROM friend_request
        JOIN users
        ON (sender_id = users.id AND sender_id <> $1)
        OR (recipient_id = users.id AND recipient_id <> $1)
        AND (recipient_id = $1 OR sender_id = $1)
        WHERE (recipient_id = $1 OR sender_id = $1);`

        const params = [userId];

        return db.query(q, params).then(function(results){
            resolve(results.rows);
        }).catch(function(e){
            reject(e);
        })
    })
}

function cancelFriendRequest(userId, OPId){
    return new Promise(function(resolve, reject){
        var status = "pending"
        const q = `DELETE FROM friend_request
        WHERE (sender_id = $1 OR recipient_id = $1)
        AND (sender_id = $2 OR recipient_id = $2)
        AND status = $3;`

        const params = [userId, OPId, status];

        return db.query(q, params).then(function(results){
            resolve(results.rows);
        }).catch(function(e){
            reject(e);
        })
    })
}


function getOnlineUsers(usersId){
    // look at the db.js line 243 of enrique project, with the ANY.

    const q = `SELECT users.id, first_name, last_name, image
    FROM users
    WHERE id
    IN(${usersId})`

    return db.query(q).then(function(results){
        return results.rows;
    })
}


function checkSearchInput(inputText){

    var text = "%" + inputText + "%";


    const q = `SELECT *
    FROM users
    WHERE (users.last_name ILIKE $1) OR (users.first_name ILIKE $1);`

    const params = [text];

    return db.query(q, params).then(function(results){
        return results.rows;
    })
}


// `SELECT * FROM users WHERE id IN(${ids})`

module.exports.registerUser = registerUser;
module.exports.login = login;
module.exports.getUserInfo = getUserInfo;
module.exports.updateImage = updateImage;
module.exports.updateBio = updateBio;
module.exports.createFriendship = createFriendship;
module.exports.CreateFriendShip = CreateFriendShip;
module.exports.UpdateFriendShip = UpdateFriendShip;
module.exports.getFriendshipStatus = getFriendshipStatus;
module.exports.getUserFriends = getUserFriends;
module.exports.cancelFriendRequest = cancelFriendRequest;
module.exports.getOnlineUsers = getOnlineUsers;
module.exports.checkSearchInput = checkSearchInput;
