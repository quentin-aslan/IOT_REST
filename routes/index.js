const express = require('express');
const router = express.Router();
const routerCam = require('./cam');
const dbManager = require('../modules/dbManager');
const debug = require('debug')('IOT_REST:API');

router.post("/dht22", async (req, res, next) => {
    try {
        const datas = req.body;

        const sensorId = await dbManager.insertSensor({
            name: datas.name,
            location: datas.location});

        await dbManager.insertSensorValue({
            sensorId,
            name: "temperature",
            value: datas.temperature});

        await dbManager.insertSensorValue({
            sensorId,
            name: "humidity",
            value: datas.humidity});

        console.log("datas : "); console.log(datas);
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get("/", async (req, res,next) => {
   try {
       const sensors = await dbManager.getAllSensors();
       const sensorValues = await dbManager.getAllSensorValues();
       res.status(200).json({sensors, sensorValues});
   } catch(e) {
       res.status(500).send(e);
   }
});

// Plus simple de mettre en get si je veux effacer depuis le portable
router.get("/delete_all", async (req, res, next) => {
    try {
        await dbManager.clearValues();
        await dbManager.clearSensors();
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.use('/cam', routerCam);


module.exports = router;
