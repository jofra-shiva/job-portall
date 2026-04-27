import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, ArrowRight, Zap, Shield, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="container">
            {/* Hero Section */}
            <section style={{ padding: '80px 0', textAlign: 'center' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}
                >
                    Find Your <span style={{ color: 'var(--primary)', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Job</span> <br /> 
                    in the Next Era
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{ fontSize: '1.2rem', color: 'var(--gray)', maxWidth: '700px', margin: '0 auto 40px' }}
                >
                    Connecting top talent with the world's most innovative companies. 
                    Simplified applications, powerful search, and real-time tracking.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass" 
                    style={{ maxWidth: '800px', margin: '0 auto', padding: '12px', display: 'flex', gap: '12px' }}
                >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--dark-light)', borderRadius: '8px', padding: '0 16px' }}>
                        <Search size={20} color="var(--gray)" />
                        <input type="text" placeholder="Job title or keywords" style={{ background: 'transparent', border: 'none', marginBottom: 0 }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--dark-light)', borderRadius: '8px', padding: '0 16px' }}>
                        <MapPin size={20} color="var(--gray)" />
                        <input type="text" placeholder="City or remote" style={{ background: 'transparent', border: 'none', marginBottom: 0 }} />
                    </div>
                    <Link to="/jobs" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Find Jobs <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid grid-3" style={{ padding: '60px 0' }}>
                <FeatureCard 
                    icon={<Zap color="var(--primary)" />} 
                    title="Quick Apply" 
                    desc="Apply to jobs with a single click using your saved profile." 
                />
                <FeatureCard 
                    icon={<Shield color="var(--secondary)" />} 
                    title="Verified Roles" 
                    desc="We manually verify companies to ensure a safe job search." 
                />
                <FeatureCard 
                    icon={<Star color="#f59e0b" />} 
                    title="Premium UI" 
                    desc="Experience a job portal designed for the modern web." 
                />
            </section>

            {/* CTA Section */}
            <section className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '60px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Take the Next Step?</h2>
                <p style={{ marginBottom: '30px', color: 'var(--gray)' }}>Join thousands of professionals already using JobFlow to grow their careers.</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-primary btn-lg">Get Started Now</Link>
                    <Link to="/jobs" className="btn btn-outline btn-lg">Browse All Jobs</Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="glass" 
        style={{ padding: '32px' }}
    >
        <div style={{ marginBottom: '20px', background: 'var(--dark-light)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
);

export default Home;
