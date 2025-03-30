import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

interface Comment {
    id: number;
    content: string;
    user?: User;
}

interface Rating {
    id: number;
    value: number | string;
    user?: User;
}

interface Recipe {
    id: number;
    title: string;
    description?: string;
    image?: string;        // Slika recepta
    steps?: string[];      // Koraki recepta
    ingredients?: { id: number; name: string }[];
    category?: { id: number; name: string };
    comments?: Comment[];
    ratings?: Rating[];
    author?: User;         // Avtor recepta
}

function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState<number>(5);

    useEffect(() => {
        if (!id) return;
        api.get(`/recipes/${id}`)
            .then(res => setRecipe(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleAddComment = () => {
        if (!id || !isAuthenticated) return;
        api.post('/comments', {
            content: newComment,
            recipeId: Number(id),
        })
            .then(res => {
                if (recipe) {
                    setRecipe({
                        ...recipe,
                        comments: [...(recipe.comments ?? []), res.data],
                    });
                }
                setNewComment('');
            })
            .catch(err => console.error(err));
    };

    const handleAddRating = () => {
        if (!id || !isAuthenticated) return;
        api.post('/ratings', {
            value: newRating,
            recipeId: Number(id),
        })
            .then(res => {
                if (recipe) {
                    setRecipe({
                        ...recipe,
                        ratings: [...(recipe.ratings ?? []), res.data],
                    });
                }
                alert('Hvala za oceno!');
            })
            .catch(err => console.error(err));
    };

    if (!recipe) return <Wrapper>Nalaganje recepta...</Wrapper>;

    const avgRating = (recipe.ratings ?? []).length > 0
        ? ((recipe.ratings ?? []).reduce((sum, r) => sum + Number(r.value), 0) / (recipe.ratings ?? []).length).toFixed(2)
        : 'Ni ocen';

    const ratingDistribution = (recipe.ratings ?? []).reduce((acc: Record<string, number>, curr) => {
        const key = curr.value.toString();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return (
        <Wrapper>
            <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-3">
                Nazaj
            </button>

            <h2>{recipe.title}</h2>

            {/* Prikaži sliko recepta, če obstaja */}
            {recipe.image && (
                <div style={{ marginBottom: '20px' }}>
                    <img
                        src={`http://localhost:3000/uploads/${recipe.image}`}
                        alt="Slika recepta"
                        style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
                    />
                </div>
            )}

            {/* Prikaži avtorja, če obstaja */}
            {recipe.author && (
                <p>
                    <strong>Avtor:</strong> {recipe.author.firstName} {recipe.author.lastName}
                </p>
            )}

            {recipe.description ? (
                <p>{recipe.description}</p>
            ) : (
                <p><em>Opis ni na voljo. Spodaj najdete korake priprave:</em></p>
            )}

            {recipe.steps && recipe.steps.length > 0 && (
                <>
                    <h4>Koraki priprave:</h4>
                    <ol>
                        {recipe.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </>
            )}

            {recipe.category && (
                <p><strong>Kategorija:</strong> {recipe.category.name}</p>
            )}

            <p><strong>Povprečna ocena:</strong> {avgRating} / 5</p>

            <h4>Sestavine:</h4>
            <ul>
                {recipe.ingredients?.map(ing => (
                    <li key={ing.id}>{ing.name}</li>
                ))}
            </ul>

            <hr />
            <h4>Komentarji:</h4>
            <ul>
                {recipe.comments?.map((c) => (
                    <li key={c.id} className="mb-3">
                        {c.user?.avatar && (
                            <img
                                src={`http://localhost:3000/uploads/${c.user.avatar}`}
                                alt="avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px' }}
                            />
                        )}
                        <strong>{c.user?.firstName} {c.user?.lastName}</strong>
                        <p className="mb-0">{c.content}</p>
                    </li>
                ))}
            </ul>

            {isAuthenticated && (
                <>
                    <div className="mb-3">
            <textarea
                className="form-control mb-2"
                placeholder="Napiši komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
                        <button className="btn btn-secondary" onClick={handleAddComment}>
                            Dodaj komentar
                        </button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tvoja ocena (1-5)</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            className="form-control"
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleAddRating}>
                            Oceni recept
                        </button>
                    </div>
                </>
            )}

            {Object.keys(ratingDistribution).length > 0 && (
                <>
                    <hr />
                    <h5>Vse ocene</h5>
                    <ul>
                        {Object.keys(ratingDistribution).map((key) => (
                            <li key={key}>
                                {key} / 5: {ratingDistribution[key]} ocen
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Wrapper>
    );
}

export default RecipeDetail;
