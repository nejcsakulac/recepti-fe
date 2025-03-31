import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import MyRecipes from './pages/MyRecipes';
import EditRecipe from './pages/EditRecipe';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/recipes/add" element={<AddRecipe />} />
                <Route path="/recipes/edit/:id" element={<EditRecipe />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/my-recipes" element={<MyRecipes />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
