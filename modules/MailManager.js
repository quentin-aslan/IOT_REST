const nodemailer = require("nodemailer");
const debug = require('debug')('IOT_REST:mail');

/**
 * @description Se charge de la connexion avec le serveur smtp et de l'envoie d'email.
 */

/**
 * @description Envoie d'un mail - API OUTLOOK
 * @param {Array} to Adresse mail du/des destinataire ["xxxx@qsdsd.com", "xxxx@qsd.com"];
 * @param {String} subject
 * @param {String} content
 * @returns {Promise<void>|Error}
 */
exports.sendMail = async function (to, subject, content) {
    try {
        debug("Envoie mail:")
        debug("to : "+to);
        debug("subject : "+subject);
        const transporter = nodemailer.createTransport({
            host: process.env.IOT_REST_SMTP_HOST,
            port: process.env.IOT_REST_SMTP_PORT,
            secure: false,
            tls: {ciphers: 'SSLv3'},
            auth: {
                user: process.env.IOT_REST_SMTP_USER,
                pass: process.env.IOT_REST_SMTP_PASSWORD
            }
        });

        const send = await transporter.sendMail({
            from: process.env.IOT_REST_SMTP_FROM,
            to,
            subject,
            html: content
        });
        debug("response api :");
        debug(send);
    } catch(e) {
        debug(e);
        throw new Error("An error occurred during the sending of the email");
    }
}

exports.boilerWarning = function(temps = []) {
    let contentTemp = '';
    for (const temp of temps) {
        if (temp.name && temp.value) {
            contentTemp += `${temp.name}: <strong>${parseFloat(temp.value).toFixed(2)}°c</strong><br>`;
        }
    }
    return `
<html>
    <p>
        <h3>Eh, fais gaffe à la chaudière elle est allumé depuis plus de 3heures ;)</h3>
        <p>C'est un mail automatique, n'y fais pas attention si c'est fais exprès</p>
        <p>${contentTemp}</p>
        <p><a href="${process.env.IOT_REST_API_IP}/boiler/off">Clique ici pour l'éteindre</a></p>
        <p><strong><3 <3</strong></p>
    </p>
</html>
`;
}
