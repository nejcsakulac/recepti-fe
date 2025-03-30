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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                {/* Levi del: Logotip in ime blagovne znamke */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src="/logo.png" // prilagodi pot do tvoje slike
                        alt="Recepti Logo"
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    />
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
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Centralni meni */}
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/recipes">Recepti</Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/recipes/add">Dodaj recept</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Moj profil</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Desni del */}
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Odjava
                                </button>
                            </li>
                        ) : (
                            <>
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
