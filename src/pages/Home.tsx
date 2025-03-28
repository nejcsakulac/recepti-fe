import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface TopRecipeRaw {
    recipe_id: number;
    recipe_title: string;
    recipe_description?: string;
    avgRating: string;
}

function Home() {
    const { isAuthenticated } = useContext(AuthContext);
    const [topRecipes, setTopRecipes] = useState<TopRecipeRaw[]>([]);

    useEffect(() => {
        api.get('/recipes/top?limit=5')
            .then(res => setTopRecipes(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Wrapper>
            <h2>Dobrodošli na strani Recepti!</h2>
            {!isAuthenticated && <p>Za več receptov se prijavite ali registrirajte!</p>}
            <h3>Top 5 najbolje ocenjenih receptov:</h3>
            {topRecipes.length === 0 ? (
                <p>Trenutno ni ocenjenih receptov.</p>
            ) : (
                topRecipes.map(r => (
                    <div key={r.recipe_id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{r.recipe_title}</h5>
                            <p className="card-text text-muted">
                                Ocena: {parseFloat(r.avgRating).toFixed(2)} / 5
                            </p>
                            <p className="card-text">{r.recipe_description}</p>
                            <a href={`/recipes/${r.recipe_id}`} className="btn btn-primary">
                                Poglej recept
                            </a>
                        </div>
                    </div>
                ))
            )}
        </Wrapper>
    );
}

export default Home;
