const dbManager = require('./modules/dbManager');

describe("Test IOT_REST", () => {

    beforeAll(async () => await dbManager.connect());

    beforeEach(async () => {
        await dbManager.clearSensors();
        await dbManager.clearValues();
    });

    afterAll(async () => dbManager.disconnect());

    it("Insert + Get all sensors", async () => {
        await dbManager.insertSensor({name: "DHT22", location: "Salon"});
        await dbManager.insertSensor({name: "SensorX", location: "Cuisine"});
        const answerSensors = await dbManager.getAllSensors();
        expect(answerSensors.length).toEqual(2);
    });

    it("Insert renvoie l'id du capteut déjà existant dans la base de données", async () => {
        const a = await dbManager.insertSensor({name: "DHT22", location: "Salon"});
        const b = await dbManager.insertSensor({name: "DHT22", location: "Salon"});
        expect(a).toEqual(b);
    });

    // Insert + get all values
    it("Insert + Get all sensor values", async () => {
        const sensorId = await dbManager.insertSensor({name: "DHT22", location: "Salon"});
        await dbManager.insertSensorValue({sensorId, name: "temperature", value: "45"});
        await dbManager.insertSensorValue({sensorId, name: "humidity", value: "59"});

        const answerSensorValues = await dbManager.getAllSensorValues();
        expect(answerSensorValues.length).toEqual(2);
    });

    it("Get sensor values by sensorid", async () => {
        const sensorId = await dbManager.insertSensor({name: "DHT22", location: "Salon"});
        const sensorId2 = await dbManager.insertSensor({name: "sensor2", location: "cuisine"});
        await dbManager.insertSensorValue({sensorId, name: "temperature", value: "45"});
        await dbManager.insertSensorValue({sensorId, name: "humidity", value: "59"});
        await dbManager.insertSensorValue({sensorId: sensorId2, name: "humidity", value: "59"})

        const answerSensorValues = await dbManager.getSensorValuesBySensorId(sensorId);
        const answerSensorValue2 = await dbManager.getSensorValuesBySensorId(sensorId2);
        expect(answerSensorValues.length).toEqual(2);
        expect(answerSensorValue2.length).toEqual(1);
    });
});