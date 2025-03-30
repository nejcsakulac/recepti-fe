import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import api from '../api/axios';

interface Rating {
    value: number | string;
}

interface Recipe {
    id: number;
    title: string;
    description?: string;
    image?: string; // Dodano: slika recepta
    ratings?: Rating[];
    avg?: string; // Lokacija, kamor shranimo izračunano povprečje
}

function Home() {
    const { isAuthenticated } = useContext(AuthContext);
    const [, setAllRecipes] = useState<Recipe[]>([]);
    const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        // Če uporabnik NI prijavljen, počistimo sezname in ne kličemo API
        if (!isAuthenticated) {
            setAllRecipes([]);
            setTopRecipes([]);
            return;
        }

        // 1) Dobimo vse recepte (z ratings)
        api.get('/recipes')
            .then(res => {
                const recipes: Recipe[] = res.data;

                // 2) Za vsak recept izračunamo povprečno oceno (kot v RecipeDetail)
                recipes.forEach(r => {
                    if (r.ratings && r.ratings.length > 0) {
                        const sum = r.ratings.reduce((acc, rate) => acc + Number(rate.value), 0);
                        const avgNum = sum / r.ratings.length;
                        r.avg = avgNum.toFixed(2);
                    } else {
                        r.avg = '0.00';
                    }
                });

                // 3) Razvrsti recepte po r.avg (DESC) in vzemi top 5
                const sorted = [...recipes].sort((a, b) => parseFloat(b.avg!) - parseFloat(a.avg!));
                const top5 = sorted.slice(0, 5);

                setAllRecipes(recipes);
                setTopRecipes(top5);
            })
            .catch(err => console.error(err));
    }, [isAuthenticated]);

    // Če ni prijavljen, samo obvestilo
    if (!isAuthenticated) {
        return (
            <Wrapper>
                <h2>Dostop do receptov ni mogoč</h2>
                <p>Za dostop se morate prijaviti ali registrirati.</p>
            </Wrapper>
        );
    }

    // Če JE prijavljen, prikažemo Top 5
    return (
        <Wrapper>
            <h2>Dobrodošli na strani Recepti!</h2>
            <h3>Top 5 najbolje ocenjenih receptov:</h3>
            {topRecipes.length === 0 ? (
                <p>Trenutno ni ocenjenih receptov.</p>
            ) : (
                topRecipes.map(r => (
                    <div key={r.id} className="card mb-3 shadow-sm">
                        {/* Če ima recept sliko, jo prikažemo */}
                        {r.image && (
                            <img
                                src={`http://localhost:3000/uploads/${r.image}`}
                                alt="Slika recepta"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                            />
                        )}
                        <div className="card-body">
                            <h5 className="card-title">{r.title}</h5>
                            <p className="card-text text-muted">
                                <strong>Povprečna ocena:</strong> {r.avg} / 5
                            </p>
                            <p className="card-text">{r.description}</p>
                            <a href={`/recipes/${r.id}`} className="btn btn-primary">
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
