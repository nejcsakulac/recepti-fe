import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/recipes/add" element={<AddRecipe />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
