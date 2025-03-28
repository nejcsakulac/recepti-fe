import { FC } from 'react';

interface Recipe {
    id: number;
    title: string;
    description?: string;
}

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text text-muted">{recipe.description}</p>
                <a href={`/recipes/${recipe.id}`} className="btn btn-primary">
                    Poglej recept
                </a>
            </div>
        </div>
    );
};

export default RecipeCard;
