const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/', auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/recruiter', auth, jobController.getRecruiterJobs);
router.get('/:id', jobController.getJobById);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;
