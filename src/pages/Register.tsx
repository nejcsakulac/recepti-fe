import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';
import { AuthContext } from '../auth/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    // Pred registracijo odjavi starega userja, če obstaja
    useEffect(() => {
        if (isAuthenticated) {
            logout();
        }
    }, [isAuthenticated, logout]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1) Registriraj novega uporabnika (brez avatarja)
            await api.post('/auth/register', {
                email,
                password,
                firstName,
                lastName,
                birthDate,
            });
            alert('Registracija uspešna!');

            // 2) Avtomatski login – s tem se shrani token novega userja
            const loginRes = await api.post('/auth/login', { email, password });
            const token = loginRes.data?.token;
            if (!token) {
                alert('Ne najdem tokena pri loginu!');
                return;
            }
            login(token);

            // 3) Preusmeri na Home (npr. "/")
            navigate('/');
        } catch (err) {
            alert('Napaka pri registraciji!');
            console.error(err);
        }
    };

    return (
        <Wrapper>
            <h2>Registracija</h2>
            <form onSubmit={handleRegister} style={{ maxWidth: '400px' }}>
                <div className="mb-3">
                    <label className="form-label">E-pošta</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Geslo</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ime</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Priimek</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Datum rojstva</label>
                    <input
                        type="date"
                        className="form-control"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-success">Registracija</button>
            </form>
        </Wrapper>
    );
}

export default Register;
