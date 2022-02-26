const debug = require('debug')('IOT_REST:sqlite');
const sqlite3 = require('sqlite3').verbose()

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
            this.db = new sqlite3.Database(sqliteName, async(error) => {
                if(error) {
                    debug("Echec de la connection SQLITE 3.");
                    return reject(error);
                }

                await self._createDefaultTables();

                return resolve();
            });
        });
    }

    /**
     * @returns {Promise<Array>}
     */
    getAllSensors () {
        return new Promise((resolve, reject) => {
            this.db.run(`SELECT * FROM sensors`, (error, rows) => {
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
            this.db.run(`SELECT * FROM sensors WHERE id = '${sensorId}'`, (error, rows) => {
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
            this.db.run(`SELECT * FROM sensors WHERE name = '${name}'`, (error, rows) => {
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
    getValuesBySensorId(sensorId) {
        return new Promise((resolve, reject) => {
            this.db.run(`SELECT * FROM values WHERE sensorId = '${sensorId}'`, (error, rows) => {
                if(error) {
                    return reject(error);
                }

                resolve(rows)
            });
        });
    }

    async insertSensor(datas) {
        const answerSensor = await this.getSensorByName(datas.name);
        if(answerSensor.length !== 0) {
            debug(`${datas.name} est déjà dans la base de données.`)
            return null;
        }

        return new Promise((resolve, reject) => {
            if(datas.name && datas.location) {
                const date = new Date();
                this.db.run(`INSERT INTO sensors(name, location) VALUES(?, ?)`, [datas.name, datas.location], (error, rows) => {
                    if(error) {
                        return reject(error);
                    }

                    resolve(rows)
                });
            } else {
                reject("Il manque des valeurs");
            }
        });
    }

    insertValue(datas) {
        return new Promise((resolve, reject) => {
            if(datas.sensorId && datas.name && datas.value) {
                const date = new Date();
                this.db.run(`INSERT INTO values(sensorId, name, value, date) VALUES(?, ?, ?, ?)`, [datas.sensorId, datas.name, datas.value, date], (error, rows) => {
                    if(error) {
                        return reject(error);
                    }

                    resolve(rows)
                });
            } else {
                reject("Il manque des valeurs");
            }
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
                            'id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                            'name' TEXT,
                            'location' TEXT);
                            
                        CREATE TABLE IF NOT EXISTS values (
                            'id' INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                            'sensorId' TEXT,
                            'name' TEXT,
                            'value' TEXT,
                            'date' DATETIME)`,

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
