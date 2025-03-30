import { useState, useEffect, useContext, FormEvent } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    avatar?: string; // to je ime datoteke na backendu
}

function Profile() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Polja za urejanje
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // Ce ni prijavljen, nazaj na login
            navigate('/login');
            return;
        }
        // Naloži userja
        api.get('/users/me')
            .then(res => {
                setProfile(res.data);
                setFirstName(res.data.firstName || '');
                setLastName(res.data.lastName || '');
                setBirthDate(res.data.birthDate || '');
            })
            .catch(err => console.error(err));
    }, [isAuthenticated, navigate]);

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Patch userja
            await api.patch('/users/me', {
                firstName,
                lastName,
                birthDate,
            });
            alert('Podatki shranjeni!');
        } catch (err) {
            console.error(err);
            alert('Napaka pri shranjevanju profila!');
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            await api.post('/users/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Avatar posodobljen!');
            // Osvezi profil
            const updated = await api.get('/users/me');
            setProfile(updated.data);
        } catch (err) {
            console.error(err);
            alert('Napaka pri nalaganju avatarja!');
        }
    };

    if (!profile) {
        return <Wrapper>Nalaganje...</Wrapper>;
    }

    return (
        <Wrapper>
            <h2>Moj profil</h2>
            <p><strong>Email:</strong> {profile.email}</p>

            {/* Avatar */}
            {profile.avatar ? (
                <div>
                    <img
                        src={`http://localhost:3000/uploads/${profile.avatar}`}
                        alt="avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                </div>
            ) : (
                <p>Nimate nastavljenega avatarja</p>
            )}

            <div className="mb-3">
                <label className="form-label">Naloži nov avatar</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setAvatarFile(e.target.files[0]);
                        }
                    }}
                />
                <button className="btn btn-primary mt-2" onClick={handleUploadAvatar}>Posodobi avatar</button>
            </div>

            <hr />

            {/* Ostali podatki */}
            <form onSubmit={handleSaveProfile} style={{ maxWidth: '400px' }}>
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

                <button type="submit" className="btn btn-success">Shrani podatke</button>
            </form>
        </Wrapper>
    );
}

export default Profile;
