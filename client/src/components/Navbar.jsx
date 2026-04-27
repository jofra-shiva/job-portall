import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, Search, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '0.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <Briefcase size={28} />
                <span>JobFlow</span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Search size={18} />
                    <span>Browse Jobs</span>
                </Link>

                {user ? (
                    <>
                        <Link to={user.role === 'recruiter' ? '/recruiter' : '/applicant'} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        
                        {user.role === 'recruiter' && (
                            <Link to="/recruiter/post-job" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={18} />
                                <span>Post Vacancy</span>
                            </Link>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
                            <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{user.name}</span>
                            <button onClick={onLogout} style={{ background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
