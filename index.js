const express = require('express');
const app = express();
const debug = require('debug')('IOT_REST:app');
const path = require('path');

// Ajax enable
const cors = require('cors');
app.use(cors());

// For receive post request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb'}));

// Récupération des variables de configuration
const fs = require('fs');
debug("Retrieving variables from the configuration file ...");
const confFilePath = path.resolve(__dirname+'/configurationFile.json');
debug(confFilePath);
const confFile = JSON.parse(fs.readFileSync(confFilePath).toString());
for(const args in confFile) process.env[args] = confFile[args];

// On établie que les fichiers static accessible sont dans le dossier public.
app.use(express.static('public'));

const apiRoutes = require('./routes/index');
app.use('/', apiRoutes);

// Connection a la base de données
const dbManager = require('./modules/dbManager');
dbManager.connect();

app.listen(process.env.IOT_REST_PORT, () => {
    debug(`Server listening on port ${process.env.IOT_REST_PORT}`);
});