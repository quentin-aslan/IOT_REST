const express = require('express');
const router = express.Router();
const routerCam = require('./cam');
const dbManager = require('../modules/dbManager');
const debug = require('debug')('IOT_REST:API');

router.post("/dht22", async (req, res, next) => {
    try {
        const datas = req.body;

        const insertSensor = await dbManager.insertSensor({name: datas.name, location: datas.location});
        debug(insertSensor);


        console.log("datas : "); console.log(datas);
        res.sendStatus(200);
    } catch(e) {
        res.status(200).send(e);
    }
});

router.use('/cam', routerCam);


module.exports = router;
