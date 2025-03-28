import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        api.post('/auth/login', { email, password })
            .then(res => {
                // V backendu recimo vrne: { message: 'Login successful', token: '...' }
                if (res.data.token) {
                    login(res.data.token);
                    navigate('/');
                }
            })
            .catch(err => {
                alert('Neuspešna prijava!');
                console.error(err);
            });
    };

    return (
        <Wrapper>
            <h2>Prijava</h2>
            <form onSubmit={handleLogin} style={{ maxWidth: '400px' }}>
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
                <button type="submit" className="btn btn-primary">Prijava</button>
            </form>
        </Wrapper>
    );
}

export default Login;
