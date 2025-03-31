import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
}

function AddRecipeWithImage() {
    const navigate = useNavigate();

    // Polja
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<string[]>(['']);
    const [ingredients, setIngredients] = useState<string[]>(['']);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Možnost “Dodaj novo kategorijo”
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // File input za sliko
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        // Naložimo obstoječe kategorije
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    // Dodaj korak
    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    const handleChangeStep = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };

    // Odstrani korak (opcijsko, če želiš)
    const handleRemoveStep = (index: number) => {
        const updated = [...steps];
        updated.splice(index, 1);
        setSteps(updated);
    };

    // Dodaj sestavino
    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleChangeIngredient = (index: number, value: string) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    // Ustvari novo kategorijo
// Ustvarimo recept s sliko
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Ker uploadamo sliko in ostale podatke, uporabimo formData
            const formData = new FormData();

            // Polja dajemo kot JSON v "jsonData"
            const jsonData = {
                title,
                description,
                steps,
                categoryId: selectedCategoryId,
                // ingredients => polje objektov { name: ... }
                ingredients: ingredients.map(name => ({ name })),
            };
            formData.append('jsonData', JSON.stringify(jsonData));

            // Dodamo sliko (če je izbrana)
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Kličemo "create-with-image"
            await api.post('/recipes/create-with-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Recept uspešno dodan!');
            navigate('/recipes');
        } catch (err) {
            console.error(err);
            alert('Napaka pri dodajanju recepta!');
        }
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

                {/* Koraki */}
                <div className="mb-3">
                    <label className="form-label">Koraki priprave</label>
                    {steps.map((step, idx) => (
                        <div key={idx} className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Korak ${idx + 1}`}
                                value={step}
                                onChange={(e) => handleChangeStep(idx, e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                onClick={() => handleRemoveStep(idx)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleAddStep}
                    >
                        Dodaj korak
                    </button>
                </div>

                {/* Sestavine */}
                <div className="mb-3">
                    <label className="form-label">Sestavine</label>
                    {ingredients.map((ing, idx) => (
                        <input
                            key={idx}
                            type="text"
                            className="form-control mb-2"
                            placeholder={`Sestavina ${idx + 1}`}
                            value={ing}
                            onChange={(e) => handleChangeIngredient(idx, e.target.value)}
                        />
                    ))}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleAddIngredient}
                    >
                        Dodaj sestavino
                    </button>
                </div>

                {/* Kategorija - z možnostjo "Dodaj kategorijo" */}
                <div className="mb-3">
                    <label className="form-label">Kategorija</label>
                    <select
                        className="form-select"
                        value={selectedCategoryId ?? ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'new') {
                                // user izbral (Dodaj kategorijo)
                                setShowNewCategoryInput(true);
                                setSelectedCategoryId(null);
                            } else if (val === '') {
                                // user izbral (Izberi kategorijo)
                                setShowNewCategoryInput(false);
                                setSelectedCategoryId(null);
                            } else {
                                setShowNewCategoryInput(false);
                                setSelectedCategoryId(Number(val));
                            }
                        }}
                    >
                        <option value="">(Izberi kategorijo)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                        <option value="new">(Dodaj kategorijo)</option>
                    </select>
                </div>

                {/* Polje za input nove kategorije, če showNewCategoryInput=true */}
                {showNewCategoryInput && (
                    <div className="mb-3">
                        <label className="form-label">Nova kategorija</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-success ms-2"
                                onClick={() => {
                                    if (!newCategoryName) return;
                                    // POST /categories
                                    api.post('/categories', { name: newCategoryName })
                                        .then(res => {
                                            const createdCat = res.data;
                                            setCategories([...categories, createdCat]);
                                            setSelectedCategoryId(createdCat.id);
                                            setShowNewCategoryInput(false);
                                            setNewCategoryName('');
                                        })
                                        .catch(err => console.error(err));
                                }}
                            >
                                Ustvari
                            </button>
                        </div>
                    </div>
                )}

                {/* Polje za sliko */}
                <div className="mb-3">
                    <label className="form-label">Slika recepta</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-success">Shrani recept</button>
            </form>
        </Wrapper>
    );
}

export default AddRecipeWithImage;
