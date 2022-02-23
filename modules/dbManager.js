const mongoose = require("mongoose") // new
const debug = require('debug')('IOT_REST:dbManager');

exports.connect = (uri) => {
    debug("Connection to database ...", uri);
    return new Promise((resolve, reject) => {
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            keepAlive: true,
            useFindAndModify: false, // ???
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000, // Keep trying to send operations for 5 seconds
            autoReconnect: true,
        };

        mongoose
            .connect(uri)
            .then(() => {
                console.log("Connection with database succced :", uri);
                resolve(true);
            }).catch(e => {
                debug("Database connection failed :", uri);
                reject(false);
        });
    });
}
