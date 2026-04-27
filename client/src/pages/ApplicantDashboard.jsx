import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ApplicantDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/user');
                setApplications(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchApplications();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '40px' }}>Your Job Applications</h1>

            {loading ? (
                <div>Loading your applications...</div>
            ) : applications.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <Briefcase size={48} color="var(--gray)" style={{ marginBottom: '16px' }} />
                    <h3>You haven't applied to any jobs yet</h3>
                    <p style={{ color: 'var(--gray)' }}>Start browsing jobs and apply to find your next opportunity.</p>
                </div>
            ) : (
                <div className="grid">
                    {applications.map(app => (
                        <motion.div 
                            key={app._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass" 
                            style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ background: 'var(--dark-light)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>{app.job.title}</h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '8px' }}>{app.job.company}</p>
                                    <div style={{ display: 'flex', gap: '16px', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} /> {app.job.location}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'primary'}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                    {app.status.toUpperCase()}
                                </span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '8px' }}>
                                    {app.status === 'pending' ? 'Application is under review' : `Application ${app.status}`}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicantDashboard;
