import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recipes as staticRecipes, Recipe } from "@/data/recipes";
import Icon from "@/components/ui/icon";

const RECIPES_URL = "https://functions.poehali.dev/216eacc5-ff5d-4098-921c-c701944d3b55";
const categories = ["Все", "Завтраки", "Обеды", "Ужины", "Перекусы"];

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(RECIPES_URL)
      .then((r) => r.json())
      .then((data) => setUserRecipes(data.recipes || []))
      .catch(() => {});
  }, []);

  const allRecipes = [...staticRecipes, ...userRecipes];
  const filtered = activeCategory === "Все"
    ? allRecipes
    : allRecipes.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-neutral-900 hover:text-neutral-600 transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm uppercase tracking-wide">ЕдаПП</span>
          </Link>
          <h1 className="text-sm uppercase tracking-wide text-neutral-600">Рецепты</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
              РЕЦЕПТЫ ПП
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl">
              Вкусные и сбалансированные блюда с подсчётом калорий и КБЖУ
            </p>
          </div>
          <button
            onClick={() => navigate("/recipes/add")}
            className="flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white hover:text-black shrink-0"
          >
            <Icon name="Plus" size={16} />
            Добавить рецепт
          </button>
        </div>

        <div className="flex gap-3 flex-wrap mb-12 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm uppercase tracking-wide border transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-neutral-300 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer" onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <div className="overflow-hidden mb-4 h-64 bg-neutral-100">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Icon name="UtensilsCrossed" size={48} />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-wide text-neutral-400">{recipe.category}</span>
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Icon name="Clock" size={12} />
                  {recipe.time}
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:underline underline-offset-2">{recipe.title}</h3>
              <p className="text-neutral-500 text-sm mb-4">{recipe.description}</p>
              <div className="flex gap-4 text-xs text-neutral-400 border-t border-neutral-100 pt-4">
                <span><strong className="text-neutral-700">{recipe.calories}</strong> ккал</span>
                <span>Б: <strong className="text-neutral-700">{recipe.protein}г</strong></span>
                <span>Ж: <strong className="text-neutral-700">{recipe.fat}г</strong></span>
                <span>У: <strong className="text-neutral-700">{recipe.carbs}г</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
