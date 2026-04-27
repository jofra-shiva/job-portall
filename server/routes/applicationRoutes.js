const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/apply', auth, upload.single('resume'), applicationController.applyForJob);
router.get('/user', auth, applicationController.getUserApplications);
router.get('/job/:jobId', auth, applicationController.getJobApplications);
router.put('/:id/status', auth, applicationController.updateApplicationStatus);

module.exports = router;
