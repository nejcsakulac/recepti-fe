import { useEffect, useState } from 'react';
import api from '../api/axios';
import Wrapper from '../components/Wrapper';

interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
}

function Admin() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const deleteUser = (id: number) => {
        if (window.confirm('Ali ste prepričani, da želite izbrisati tega uporabnika?')) {
            api.delete(`/admin/users/${id}`)
                .then(() => {
                    setUsers(users.filter(u => u.id !== id));
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <Wrapper>
            <h2>Admin Panel</h2>
            <h3>Uporabniki</h3>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Ime</th>
                    <th>Priimek</th>
                    <th>Admin</th>
                    <th>Akcije</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.isAdmin ? 'Da' : 'Ne'}</td>
                        <td>
                            {/* Zaenkrat le brisanje; urejanje lahko dodaš kasneje */}
                            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>
                                Izbriši
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Wrapper>
    );
}

export default Admin;
