import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
    description?: string;
}

function AddRecipe() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>(''); // izbran categoryName

    useEffect(() => {
        // Naložimo seznam kategorij z backenda
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!isAuthenticated) {
        return <Wrapper>Za dodajanje receptov se moraš prijaviti!</Wrapper>;
    }

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleChangeIngredient = (index: number, value: string) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title,
            description,
            ingredients: ingredients.map(name => ({ name })),
            categoryName: selectedCategoryName || undefined,
            // Lahko namesto categoryName pošlješ categoryId, odvisno kaj si se odločil v backendu
        };
        api.post('/recipes', data)
            .then(() => {
                alert('Recept ustvarjen!');
                navigate('/recipes');
            })
            .catch(err => console.error(err));
    };

    return (
        <Wrapper>
            <h2>Dodaj nov recept</h2>
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Naslov</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Opis</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Sestavine */}
                <div className="mb-3">
                    <label className="form-label">Sestavine</label>
                    {ingredients.map((ing, i) => (
                        <input
                            key={i}
                            type="text"
                            className="form-control mb-2"
                            value={ing}
                            onChange={(e) => handleChangeIngredient(i, e.target.value)}
                        />
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddIngredient}>
                        Dodaj sestavino
                    </button>
                </div>

                {/* Dropdown za kategorije */}
                <div className="mb-3">
                    <label className="form-label">Kategorija</label>
                    <select
                        className="form-select"
                        value={selectedCategoryName}
                        onChange={(e) => setSelectedCategoryName(e.target.value)}
                    >
                        <option value="">(Izberi kategorijo)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success">Shrani recept</button>
            </form>
        </Wrapper>
    );
}

export default AddRecipe;
