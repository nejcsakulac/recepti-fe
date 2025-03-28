import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <strong>Recepti</strong>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/recipes">Vsi recepti</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/recipes/add">Dodaj recept</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn nav-link" onClick={handleLogout}>
                                        Odjava
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/recipes">Recepti</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Prijava</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registracija</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
