const Job = require('../models/Job');

exports.createJob = async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ msg: 'Unauthorized: Only recruiters can post jobs' });
    }
    try {
        const newJob = new Job({
            ...req.body,
            recruiter: req.user.id
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobs = async (req, res) => {
    try {
        const { search, location, jobType } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        if (location) query.location = { $regex: location, $options: 'i' };
        if (jobType) query.jobType = jobType;

        const jobs = await Job.find(query).populate('recruiter', 'name').sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('recruiter', 'name');
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user.id }).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
