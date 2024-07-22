const express = require('express');
const resumePDFController = require('../../controllers/resumePDF.controller');
const { oauth2Client, google } = require('../../config/googledrive');
const multer = require('multer');
const router = express.Router();
const cors = require('cors');
const fetch = require('node-fetch');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/upload').post(upload.single('pdf'), resumePDFController.uploadResumePDF);
router.route('/files').get(resumePDFController.getResumeByList);
//router.route('/googleDrive/sync').get(resumePDFController.checkAndUploadResumes);
router.route('/file/:id').get(resumePDFController.getResumeById);
router.route('/file/:id').delete(resumePDFController.deleteResumeById);
router.route('/filepage').get(resumePDFController.getResumeBypage);

router.route('/auth/google').get((req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive'],
  });
  res.redirect(url);
});

router.route('/google/redirect').get(async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
    req.session.tokens = tokens;
    console.log(req.session.tokens);
    res.send(tokens);
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Authentication failed');
  }
});

router.route('/google/token').get(async (req, res) => {
  if (req.session.tokens) {
    res.json({ token: req.session.tokens.access_token });
  } else {
    res.status(401).json({ error: 'No authentication tokens found' });
  }
});

function convertToDownloadUrl(viewUrl) {
  const match = viewUrl.match(/\/d\/(.+?)\//);
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  // biome-ignore lint/style/noUselessElse: <explanation>
  else {
    throw new Error('Could not extract File ID from view URL');
  }
}

router.route('/downloadFileFromGoogleDrive/:id').get(async (req, res) => {
  const fileId = req.params.id;
  try {
    // Ensure the Google Drive API client is authenticated
    if (!oauth2Client.credentials) {
      throw new Error('The OAuth2 client has not been authenticated');
    }

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Get the file metadata to set the correct content type
    const metaData = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType',
    });

    // Set the response content type to the file's mime type
    res.type(metaData.data.mimeType);

    // Stream the file from Google Drive directly to the client
    await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' }, (err, driveResponse) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).send('Error downloading file');
      }
      driveResponse.data
        .on('end', () => {
          console.log('Done downloading file.');
        })
        .on('error', (err) => {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file');
        })
        .pipe(res);
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});

module.exports = router;
