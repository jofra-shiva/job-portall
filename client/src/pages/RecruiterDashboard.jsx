import { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusCircle, Users, Trash2, ExternalLink, Briefcase } from 'lucide-react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RecruiterDashboard = () => {
    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem' }}>Recruiter Dashboard</h1>
                <Link to="post-job" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={20} /> Post New Vacancy
                </Link>
            </div>

            <Routes>
                <Route path="/" element={<JobList />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/applications/:jobId" element={<JobApplications />} />
            </Routes>
        </div>
    );
};

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs/recruiter');
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const deleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j._id !== id));
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    if (loading) return <div>Loading vacancies...</div>;

    return (
        <div className="grid">
            {jobs.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <Briefcase size={48} color="var(--gray)" style={{ marginBottom: '16px' }} />
                    <h3>No vacancies posted yet</h3>
                    <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Start attracting talent by posting your first job opening.</p>
                    <Link to="post-job" className="btn btn-primary">Post Vacancy</Link>
                </div>
            ) : (
                jobs.map(job => (
                    <motion.div key={job._id} className="glass" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ marginBottom: '4px' }}>{job.title}</h3>
                            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Posted on {new Date(job.postedAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to={`/recruiter/applications/${job._id}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={18} /> View Applicants
                            </Link>
                            <button onClick={() => deleteJob(job._id)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: 'Full-time'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(r => r.trim())
            };
            await api.post('/jobs', data);
            navigate('/recruiter');
        } catch (err) {
            alert('Failed to post job');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
            <h2 style={{ marginBottom: '32px' }}>Post a New Vacancy</h2>
            <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Job Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div>
                    <label>Company Name</label>
                    <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                </div>
                <div>
                    <label>Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="e.g. Remote, NYC" />
                </div>
                <div>
                    <label>Job Type</label>
                    <select value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div>
                    <label>Salary Range</label>
                    <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $100k - $120k" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Job Description</label>
                    <textarea rows="6" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ width: '100%' }}></textarea>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Requirements (One per line)</label>
                    <textarea rows="4" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} required style={{ width: '100%' }}></textarea>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Job</button>
                    <button type="button" onClick={() => navigate('/recruiter')} className="btn btn-outline">Cancel</button>
                </div>
            </form>
        </motion.div>
    );
};

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await api.get(`/applications/job/${jobId}`);
                setApplications(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchApps();
    }, [jobId]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/applications/${id}/status`, { status });
            setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>Applicants for this Role</h2>
            <div className="grid">
                {applications.length === 0 ? (
                    <p>No applications received yet.</p>
                ) : (
                    applications.map(app => (
                        <div key={app._id} className="glass" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>{app.applicant.name}</h3>
                                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '8px' }}>{app.applicant.email}</p>
                                <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'primary'}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <a href={`http://localhost:5000/${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ExternalLink size={16} /> Resume
                                </a>
                                {app.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateStatus(app._id, 'accepted')} className="btn btn-primary" style={{ background: 'var(--success)' }}>Accept</button>
                                        <button onClick={() => updateStatus(app._id, 'rejected')} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Reject</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
