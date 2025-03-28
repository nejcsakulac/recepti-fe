import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import RecipeCard from '../components/RecipeCard';
import api from '../api/axios';

interface Recipe {
    id: number;
    title: string;
    description?: string;
}

function Recipes() {
    const { isAuthenticated } = useContext(AuthContext);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // Naloži vse recepte
        api.get('/recipes')
            .then((res) => setRecipes(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <Wrapper>
            <h2>Vsi recepti</h2>
            {!isAuthenticated && (
                <p>Prijavi se, da vidiš več podrobnosti in dodaš nove recepte.</p>
            )}
            <div>
                {recipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                ))}
            </div>
        </Wrapper>
    );
}

export default Recipes;
