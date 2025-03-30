// src/components/CategoriesSideBar.tsx
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
}

interface CategoriesSideBarProps {
    onSelectCategory: (categoryId: number | null) => void;
}

function CategoriesSideBar({ onSelectCategory }: CategoriesSideBarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        // Naložimo kategorije iz API-ja
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSelect = (category: Category | null) => {
        if (category) {
            setSelectedCategory(category.id);
            onSelectCategory(category.id);
        } else {
            // Ko izberemo "Vse"
            setSelectedCategory(null);
            onSelectCategory(null);
        }
    };

    return (
        <div className="mb-4">
            <h4>Kategorije</h4>
            {/* flex-wrap omogoči prelome v nove vrstice, gap-2 doda presledek */}
            <div className="d-flex flex-wrap gap-2">
                {/* Gumb "Vse" */}
                <button
                    className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSelect(null)}
                >
                    Vse
                </button>
                {/* Ostale kategorije */}
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleSelect(cat)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoriesSideBar;
