import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Wrapper from '../components/Wrapper';
import CategoriesSideBar from '../components/CategoriesSideBar';
import api from '../api/axios';

interface Recipe {
    id: number;
    title: string;
    description?: string;
    image?: string; // Slika recepta
}

function Recipes() {
    const { isAuthenticated } = useContext(AuthContext);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        const url =
            selectedCategory !== null
                ? `/recipes?categoryId=${selectedCategory}`
                : '/recipes';
        api
            .get(url)
            .then((res) => setRecipes(res.data))
            .catch((err) => console.error(err));
    }, [selectedCategory]);

    return (
        <Wrapper>
            <div className="row">
                {/* Filter kategorij */}
                <div className="col-md-3">
                    <CategoriesSideBar onSelectCategory={setSelectedCategory} />
                </div>
                {/* Seznam receptov */}
                <div className="col-md-9">
                    <h2>Vsi recepti</h2>
                    {!isAuthenticated && (
                        <p>Prijavi se, da vidiš več podrobnosti in dodaš nove recepte.</p>
                    )}
                    <div className="row">
                        {recipes.map((r) => (
                            <div key={r.id} className="col-md-6">
                                <div className="card mb-3 shadow-sm">
                                    {r.image && (
                                        <img
                                            src={`http://localhost:3000/uploads/${r.image}`}
                                            className="card-img-top"
                                            alt="Slika recepta"
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{r.title}</h5>
                                        <p className="card-text text-muted">
                                            {r.description &&
                                            r.description.length > 80
                                                ? r.description.substring(0, 80) + '...'
                                                : r.description}
                                        </p>
                                        <a href={`/recipes/${r.id}`} className="btn btn-primary">
                                            Poglej recept
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

export default Recipes;
