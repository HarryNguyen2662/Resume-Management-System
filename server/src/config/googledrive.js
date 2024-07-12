const dotenv = require('dotenv');
dotenv.config();

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
module.exports = { oauth2Client, google };

/*
{"web":{
"client_id":"579506460829-rojvfppgli45e7h6lvfjbtodsgil1vnd.apps.googleusercontent.com",
"project_id":"coderpush-cv-management",
"auth_uri":"https://accounts.google.com/o/oauth2/auth",
"token_uri":"https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
"client_secret":"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"}
}
*/
