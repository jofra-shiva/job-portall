import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, MapPin, Briefcase, Filter, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        jobType: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/jobs?${params}`);
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                {/* Sidebar Filters */}
                <aside className="glass" style={{ width: '300px', padding: '24px', position: 'sticky', top: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <Filter size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '1.2rem' }}>Filters</h3>
                    </div>

                    <form onSubmit={handleSearch}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Keywords</label>
                        <input 
                            type="text" 
                            placeholder="Design, Developer..." 
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />

                        <label style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Location</label>
                        <input 
                            type="text" 
                            placeholder="Remote, NY..." 
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />

                        <label style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Job Type</label>
                        <select 
                            value={filters.jobType}
                            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        >
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Apply Filters
                        </button>
                    </form>
                </aside>

                {/* Job Listings */}
                <main style={{ flex: 1 }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.8rem' }}>Available Vacancies ({jobs.length})</h2>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div className="glass" style={{ textAlign: 'center', padding: '60px' }}>
                            <Briefcase size={48} color="var(--gray)" style={{ marginBottom: '16px' }} />
                            <h3>No jobs found</h3>
                            <p style={{ color: 'var(--gray)' }}>Try adjusting your filters to find more opportunities.</p>
                        </div>
                    ) : (
                        <div className="grid" style={{ gap: '16px' }}>
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const JobCard = ({ job }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
        className="glass" 
        style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Briefcase size={24} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{job.title}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 500, marginBottom: '8px' }}>{job.company}</p>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--gray)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {job.location}
                    </span>
                    <span className="badge badge-primary">{job.jobType}</span>
                </div>
            </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '12px' }}>{job.salary || 'Competitive'}</p>
            <Link to={`/jobs/${job._id}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                Details <ChevronRight size={16} />
            </Link>
        </div>
    </motion.div>
);

export default Jobs;
