const debug = require('debug')('IOT_REST:sqlite');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFolderPath = path.resolve("/opt")

class DbManager {
    static getSingleton () {
        if(!DbManager.singleton) {
            DbManager.singleton = new DbManager();
        }

        return DbManager.singleton;
    }

    constructor() {
        this.isConnected = false;
        this.db = null;
    }

    /**
     * Connection à la base de données SQLITE
     * @param {string} sqliteName Nom de la base de données (Défaut : IOT_REST.db)
     * @returns {Promise<unknown>}
     */
    connect(sqliteName = "IOT_REST.db") {
        const self = this;
        return new Promise((resolve, reject) => {
            const dbPath = path.resolve(dbFolderPath+"/"+sqliteName);
            this.db = new sqlite3.Database(dbPath, async(error) => {
                if(error) {
                    debug("Echec de la connection SQLITE 3.");
                    return reject(error);
                }

                await self._createDefaultTables();

                return resolve();
            });
        });
    }

    disconnect() {
        this.db.close();
    }

    /**
     * @returns {Promise<Array>}
     */
    getAllSensors () {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sensors;`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows)
            });
        });
    }

    /**
     * @param {string} sensorId
     * @returns {Promise<Array>}
     */
    getSensorById(sensorId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sensors WHERE id = '${sensorId}'`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows)
            });
        });
    }

    /**
     * @param {string} name
     * @returns {Promise<Array>}
     */
    getSensorByName(name) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sensors WHERE name = '${name}'`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    /**
     * @returns {Promise<Array>}
     */
    getAllSensorValues () {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sensorValues;`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows)
            });
        });
    }

    /**
     * @param {string} sensorId
     * @returns {Promise<Array>}
     */
    getSensorValuesBySensorId(sensorId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sensorValues WHERE sensorId = '${sensorId}'`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows)
            });
        });
    }

    /**
     * Ajoute un capteur dans la base de données
     * @param {{name: string, location: string}} datas
     * @returns {Promise<unknown>}
     */
    async insertSensor(datas) {
        const answerSensor = await this.getSensorByName(datas.name);
        if(answerSensor && answerSensor.length !== 0) {
            debug(`${datas.name} est déjà dans la base de données.`)
            return answerSensor[0].id;
        }

        return new Promise((resolve, reject) => {
            if(datas.name && datas.location) {
                this.db.run(`INSERT INTO sensors(name, location) VALUES(?, ?)`, [datas.name, datas.location], function (error) {
                    if(error) {
                        return reject(error);
                    }

                    // this.lastID => Renvoyé par SQLITE
                    return resolve(this.lastID);
                });
            } else {
                reject("Il manque des valeurs");
            }
        });
    }

    /**
     * Ajoute une valeur dans la base de données
     * @param {{sensorId: string, name: string, value: string}} datas
     * @returns {Promise<unknown>}
     */
    insertSensorValue(datas) {
        return new Promise((resolve, reject) => {
            if(datas.sensorId && datas.name && datas.value) {
                const date = new Date.now();
                new Date().toLocaleTimeString()
                this.db.run(`INSERT INTO sensorValues(sensorId, name, value, date) VALUES(?, ?, ?, ?)`, [datas.sensorId, datas.name, datas.value, date], (error) => {
                    if(error) {
                        return reject(error);
                    }

                    // this.lastID => Renvoyé par SQLITE
                    return resolve(this.lastID);
                });
            } else {
                reject("Il manque des valeurs");
            }
        });
    }

    clearSensors() {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM sensors`, (error) => {
                    if(error) {
                        return reject(error);
                    }

                    resolve();
                });
        });
    }

    clearValues() {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM sensorValues`, (error) => {
                if(error) {
                    return reject(error);
                }

                resolve();
            });
        });
    }

    /**
     * Créer les table par défault dans SQLITE
     * @returns {Promise<void|Error>}
     * @private
     */
    _createDefaultTables() {
        return new Promise((resolve, reject) => {
            // Avec deux tables ... (Mais chiant a gérer)
            this.db.exec(`CREATE TABLE IF NOT EXISTS sensors (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT,
                            location TEXT);
                            
                        CREATE TABLE IF NOT EXISTS sensorValues (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            sensorId TEXT,
                            name TEXT,
                            value TEXT,
                            date DATETIME);`,

                        (err) => {
                            if(err) {
                                return reject(err);
                            }

                            return resolve();
                });
        });
    }
}

module.exports = DbManager.getSingleton();
