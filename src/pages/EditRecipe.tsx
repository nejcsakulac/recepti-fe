import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
}

function EditRecipe() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Stanja za podatke recepta
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<string[]>(['']);
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [existingImage, setExistingImage] = useState(''); // URL obstoječe slike
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Stanja za kategorije
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        // Naloži obstoječe kategorije
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Napaka pri nalaganju kategorij:', err));

        // Naloži podatke recepta
        api.get(`/recipes/${id}`)
            .then(res => {
                const data = res.data;
                setTitle(data.title);
                setDescription(data.description);
                setSteps(data.steps && data.steps.length > 0 ? data.steps : ['']);
                setIngredients(data.ingredients && data.ingredients.length > 0 ? data.ingredients.map((ing: any) => ing.name) : ['']);
                if (data.category) {
                    setSelectedCategoryId(data.category.id);
                }
                if (data.image) {
                    setExistingImage(data.image);
                }
            })
            .catch(err => console.error('Napaka pri nalaganju recepta:', err));
    }, [id]);

    // Funkcije za korake
    const handleAddStep = () => setSteps([...steps, '']);
    const handleChangeStep = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };
    const handleRemoveStep = (index: number) => {
        const updated = [...steps];
        updated.splice(index, 1);
        setSteps(updated);
    };

    // Funkcije za sestavine
    const handleAddIngredient = () => setIngredients([...ingredients, '']);
    const handleChangeIngredient = (index: number, value: string) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Uporabimo FormData za posodobitev recepta z možnostjo prenosa nove slike
            const formData = new FormData();

            const jsonData = {
                title,
                description,
                steps,
                categoryId: selectedCategoryId,
                // Sestavine kot polje objektov { name: string }
                ingredients: ingredients.map(name => ({ name })),
            };
            formData.append('jsonData', JSON.stringify(jsonData));

            // Če je izbrana nova slika, jo dodamo; sicer ostane obstoječa
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.patch(`/recipes/edit/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Recept uspešno posodobljen!');
            navigate('/my-recipes');
        } catch (err) {
            console.error('Napaka pri posodabljanju recepta:', err);
            alert('Napaka pri posodabljanju recepta!');
        }
    };

    return (
        <Wrapper>
            <h2>Uredi recept</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Naslov</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Opis</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                {/* Koraki priprave */}
                <div className="mb-3">
                    <label className="form-label">Koraki priprave</label>
                    {steps.map((step, idx) => (
                        <div key={idx} className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Korak ${idx + 1}`}
                                value={step}
                                onChange={e => handleChangeStep(idx, e.target.value)}
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
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddStep}>
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
                            onChange={e => handleChangeIngredient(idx, e.target.value)}
                        />
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddIngredient}>
                        Dodaj sestavino
                    </button>
                </div>
                {/* Dropdown za kategorijo */}
                <div className="mb-3">
                    <label className="form-label">Kategorija</label>
                    <select
                        className="form-select"
                        value={selectedCategoryId ?? ''}
                        onChange={e => {
                            const val = e.target.value;
                            if (val === 'new') {
                                setShowNewCategoryInput(true);
                                setSelectedCategoryId(null);
                            } else if (val === '') {
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
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="new">(Dodaj kategorijo)</option>
                    </select>
                </div>
                {showNewCategoryInput && (
                    <div className="mb-3">
                        <label className="form-label">Nova kategorija</label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-success ms-2"
                                onClick={() => {
                                    if (!newCategoryName) return;
                                    // Ustvari novo kategorijo
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
                {/* Polje za spreminjanje slike */}
                <div className="mb-3">
                    <label className="form-label">Spremeni sliko (če želiš)</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={e => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />
                    {/* Prikaži obstoječo sliko, če nova ni izbrana */}
                    {existingImage && !imageFile && (
                        <div className="mt-2">
                            <p>Obstoječa slika:</p>
                            <img
                                src={`http://localhost:3000/uploads/${existingImage}`}
                                alt="Obstoječa slika"
                                style={{ maxWidth: '200px' }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Posodobi recept</button>
            </form>
        </Wrapper>
    );
}

export default EditRecipe;
