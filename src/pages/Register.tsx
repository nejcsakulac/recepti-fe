import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatar, setAvatar] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        api.post('/auth/register', { email, password, firstName, lastName })
            .then(() => {
                alert('Registracija uspešna!');
                navigate('/login');
            })
            .catch((err) => {
                alert('Napaka pri registraciji!');
                console.error(err);
            });
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

                <div className="mb-3">
                    <label className="form-label">Avatar (URL)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>



                <button type="submit" className="btn btn-success">Registracija</button>
            </form>
        </Wrapper>
    );
}

export default Register;
