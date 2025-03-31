import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Wrapper from '../components/Wrapper';

interface Recipe {
    id: number;
    title: string;
    description?: string;
    image?: string;
}

function MyRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Endpoint, ki vrne recepte trenutnega uporabnika
        api.get('/recipes/my')
            .then((res) => setRecipes(res.data))
            .catch((err) => console.error('Napaka pri nalaganju receptov:', err));
    }, []);

    const deleteRecipe = (id: number) => {
        if (window.confirm('Ali ste prepričani, da želite izbrisati ta recept?')) {
            api.delete(`/recipes/${id}`)
                .then(() => {
                    setRecipes(recipes.filter((r) => r.id !== id));
                })
                .catch((err) => console.error('Napaka pri brisanju recepta:', err));
        }
    };

    const editRecipe = (id: number) => {
        // Preusmeritev na stran za urejanje recepta
        navigate(`/recipes/edit/${id}`);
    };

    return (
        <Wrapper>
            <h2>Moji recepti</h2>
            {recipes.length === 0 ? (
                <p>Trenutno nimate vnešenih receptov.</p>
            ) : (
                <div className="row">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-6">
                            <div className="card mb-3 shadow-sm">
                                {recipe.image && (
                                    <img
                                        src={`http://localhost:3000/uploads/${recipe.image}`}
                                        alt="Slika recepta"
                                        className="card-img-top"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>
                                    <p className="card-text">
                                        {recipe.description ? recipe.description : 'Brez opisa'}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => editRecipe(recipe.id)}
                                        >
                                            Uredi
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteRecipe(recipe.id)}
                                        >
                                            Izbriši
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Wrapper>
    );
}

export default MyRecipes;
