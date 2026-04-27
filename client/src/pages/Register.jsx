import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'applicant'
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass" 
                style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
            >
                <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
                <p style={{ color: 'var(--gray)', textAlign: 'center', marginBottom: '32px' }}>Join our community of professionals</p>
                
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name</label>
                    <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="John Doe"
                    />

                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="john@example.com"
                    />
                    
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
                    <input 
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                        placeholder="••••••••"
                    />

                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>I am a...</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'applicant'})}
                            className={formData.role === 'applicant' ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ flex: 1 }}
                        >
                            Applicant
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'recruiter'})}
                            className={formData.role === 'recruiter' ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ flex: 1 }}
                        >
                            Recruiter
                        </button>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                        Create Account
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--gray)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
