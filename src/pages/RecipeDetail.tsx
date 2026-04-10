import { useParams, Link, useNavigate } from "react-router-dom";
import { recipes } from "@/data/recipes";
import Icon from "@/components/ui/icon";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Рецепт не найден</p>
        <Link to="/recipes" className="underline text-sm">← Все рецепты</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/recipes")}
            className="flex items-center gap-2 text-neutral-900 hover:text-neutral-500 transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm uppercase tracking-wide">Рецепты</span>
          </button>
          <span className="text-xs uppercase tracking-wide text-neutral-400">{recipe.category}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 h-[400px] md:h-[520px] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-3">
              {recipe.title.toUpperCase()}
            </h1>
            <p className="text-neutral-500 text-lg max-w-xl">{recipe.description}</p>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <Icon name="Clock" size={16} />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <Icon name="Users" size={16} />
              <span>{recipe.servings} порц.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-12 border-t border-b border-neutral-100 py-6">
          {[
            { label: "Калории", value: recipe.calories, unit: "ккал" },
            { label: "Белки", value: recipe.protein, unit: "г" },
            { label: "Жиры", value: recipe.fat, unit: "г" },
            { label: "Углеводы", value: recipe.carbs, unit: "г" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-neutral-900">{item.value}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mt-1">{item.unit}</p>
              <p className="text-xs text-neutral-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 mb-6">
              Ингредиенты
            </h2>
            <ul className="flex flex-col gap-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 mb-6">
              Приготовление
            </h2>
            <ol className="flex flex-col gap-6">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-3xl font-bold text-neutral-100 leading-none shrink-0 w-8">
                    {i + 1}
                  </span>
                  <p className="text-neutral-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
