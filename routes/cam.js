const debug = require('debug')('IOT_REST:api:cam');
const express = require('express');
const router = express.Router();
const Path = require('path');
const Fs = require('fs');



/**
 * @description Demande à l'espCam de prendre une photo
 */
router.get('/photo', async (req, res, next) => {
    try {
        const nameFile = 'esp32Cam_'+Date.now()+'.jpg';
        const path = Path.resolve(__dirname, 'images', nameFile);
        const writer = Fs.createWriteStream(path);

        // FIXME: Gérer avec fetch (attention, flux a gérer, pas une requête normal?)
        // const response = await Axios({
        //     url: `${process.env.IOT_REST_CAM_IP}/jpg/image.jpg`,
        //     method: 'GET',
        //     responseType: 'stream'
        // });
        //
        // response.data.pipe(writer);
        //
        // response.data.on('end', function () {
        //     res.sendFile(__dirname+"/images/"+nameFile);
        // });
        res.sendStatus(200);
    }catch (e) {
        debug(e);
        res.status(500).send(e);
    }
});

module.exports = router;
