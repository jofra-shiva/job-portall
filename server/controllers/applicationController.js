const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyForJob = async (req, res) => {
    if (req.user.role !== 'applicant') {
        return res.status(403).json({ msg: 'Only applicants can apply for jobs' });
    }
    try {
        const { jobId } = req.body;
        const resumeUrl = req.file ? req.file.path : null;

        if (!resumeUrl) {
            return res.status(400).json({ msg: 'Please upload a resume' });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        const application = new Application({
            job: jobId,
            applicant: req.user.id,
            resumeUrl
        });

        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', ['name', 'email'])
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', ['title', 'company', 'location'])
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');
        if (!application) return res.status(404).json({ msg: 'Application not found' });
        
        if (application.job.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        application.status = status;
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
