import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const categories = ["Все", "Завтраки", "Обеды", "Ужины", "Перекусы"];

const recipes = [
  {
    id: 1,
    title: "Овсянка с ягодами",
    category: "Завтраки",
    time: "10 мин",
    calories: 320,
    protein: 12,
    fat: 8,
    carbs: 52,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/0af60a31-91c5-484a-ad21-2b67bea0e990.jpg",
    description: "Питательный завтрак с ягодами, бананом и семенами чиа.",
  },
  {
    id: 2,
    title: "Боул с киноа",
    category: "Обеды",
    time: "25 мин",
    calories: 480,
    protein: 18,
    fat: 14,
    carbs: 62,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/9980d071-819c-4c4c-be54-e3aa58954c1a.jpg",
    description: "Сытный боул с нутом, авокадо и соусом тахини.",
  },
  {
    id: 3,
    title: "Лосось с овощами",
    category: "Ужины",
    time: "30 мин",
    calories: 420,
    protein: 38,
    fat: 18,
    carbs: 22,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/6c72d4c5-b3dd-4f02-a2f8-75c33774c714.jpg",
    description: "Запечённый лосось со спаржей и черри-томатами.",
  },
  {
    id: 4,
    title: "Смузи-боул",
    category: "Перекусы",
    time: "10 мин",
    calories: 280,
    protein: 8,
    fat: 6,
    carbs: 48,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/ec2fd897-389e-4996-8308-ebbd9c32cc6c.jpg",
    description: "Зелёный смузи-боул со шпинатом, манго и гранолой.",
  },
  {
    id: 5,
    title: "Чечевичный суп",
    category: "Обеды",
    time: "40 мин",
    calories: 350,
    protein: 20,
    fat: 6,
    carbs: 55,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/306e666a-2e4a-49ba-8954-e678ba87127e.jpg",
    description: "Согревающий суп из чечевицы с морковью и сельдереем.",
  },
  {
    id: 6,
    title: "Курица с бататом",
    category: "Ужины",
    time: "45 мин",
    calories: 460,
    protein: 42,
    fat: 12,
    carbs: 40,
    image: "https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/3523a62b-ce5f-43fb-bf12-9b8f3dff967d.jpg",
    description: "Запечённая куриная грудка с бататом и брокколи.",
  },
];

export default function Recipes() {
  const [activeCategory, setActiveCategory] = useState("Все");

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
            <div key={recipe.id} className="group cursor-pointer">
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
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{recipe.title}</h3>
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
