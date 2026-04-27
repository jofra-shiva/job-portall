import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, MapPin, Calendar, DollarSign, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!file) return alert('Please upload your resume');

        setApplying(true);
        const formData = new FormData();
        formData.append('jobId', id);
        formData.append('resume', file);

        try {
            await api.post('/applications/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setApplied(true);
        } catch (err) {
            alert(err.response?.data?.msg || 'Application failed');
        }
        setApplying(false);
    };

    if (loading) return <div className="container" style={{ padding: '40px' }}>Loading job details...</div>;
    if (!job) return <div className="container" style={{ padding: '40px' }}>Job not found</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', marginBottom: '32px' }}>
                <ArrowLeft size={20} /> Back to Search
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* Main Content */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="glass" style={{ padding: '40px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{job.title}</h1>
                                <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>{job.company}</p>
                            </div>
                            <span className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '1rem' }}>{job.jobType}</span>
                        </div>

                        <div className="grid grid-3" style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '24px 0', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin color="var(--primary)" />
                                <div>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Location</p>
                                    <p>{job.location}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <DollarSign color="var(--primary)" />
                                <div>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Salary Range</p>
                                    <p>{job.salary || 'Competitive'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar color="var(--primary)" />
                                <div>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Posted On</p>
                                    <p>{new Date(job.postedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '16px' }}>Job Description</h3>
                        <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '32px', whiteSpace: 'pre-wrap' }}>
                            {job.description}
                        </p>

                        <h3 style={{ marginBottom: '16px' }}>Requirements</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {job.requirements.map((req, index) => (
                                <li key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', color: 'var(--gray)' }}>
                                    <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Apply Sidebar */}
                <aside>
                    <div className="glass" style={{ padding: '32px', position: 'sticky', top: '80px' }}>
                        {applied ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h3 style={{ marginBottom: '8px' }}>Application Sent!</h3>
                                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '24px' }}>The recruiter has been notified of your interest.</p>
                                <button onClick={() => navigate('/applicant')} className="btn btn-outline" style={{ width: '100%' }}>View Applications</button>
                            </div>
                        ) : user?.role === 'recruiter' ? (
                            <div style={{ textAlign: 'center', color: 'var(--gray)' }}>
                                <p>Recruiters cannot apply for jobs.</p>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: '24px' }}>Apply for this role</h3>
                                <form onSubmit={handleApply}>
                                    <div 
                                        style={{ 
                                            border: '2px dashed var(--glass-border)', 
                                            borderRadius: '12px', 
                                            padding: '40px 20px', 
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            marginBottom: '24px',
                                            transition: 'var(--transition)'
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setFile(e.dataTransfer.files[0]);
                                        }}
                                        onClick={() => document.getElementById('resume-upload').click()}
                                    >
                                        <Upload size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
                                        <p style={{ fontSize: '0.9rem', color: file ? 'var(--light)' : 'var(--gray)' }}>
                                            {file ? file.name : 'Click or drag to upload resume'}
                                        </p>
                                        <input 
                                            id="resume-upload" 
                                            type="file" 
                                            hidden 
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', padding: '16px' }}
                                        disabled={applying}
                                    >
                                        {applying ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)', textAlign: 'center', marginTop: '16px' }}>
                                        By applying, you agree to share your profile and resume with {job.company}.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default JobDetail;
