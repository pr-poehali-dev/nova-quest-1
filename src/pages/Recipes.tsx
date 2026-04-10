import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recipes } from "@/data/recipes";
import Icon from "@/components/ui/icon";

const categories = ["Все", "Завтраки", "Обеды", "Ужины", "Перекусы"];

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const navigate = useNavigate();

  const filtered = activeCategory === "Все"
    ? recipes
    : recipes.filter((r) => r.category === activeCategory);

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
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
          РЕЦЕПТЫ ПП
        </h2>
        <p className="text-neutral-500 text-lg mb-12 max-w-xl">
          Вкусные и сбалансированные блюда с подсчётом калорий и КБЖУ
        </p>

        <div className="flex gap-3 flex-wrap mb-12">
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
              <div className="overflow-hidden mb-4 h-64">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
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