const express = require('express');
const router = express.Router();
const routerCam = require('./cam');

router.post("/dht22", (req, res, next) => {
    try {
        const datas = req.body;
        console.log("datas : "); console.log(datas);
        res.sendStatus(200);
    } catch(e) {
        res.status(200).send(e);
    }
});

router.use('/cam', routerCam);


module.exports = router;
