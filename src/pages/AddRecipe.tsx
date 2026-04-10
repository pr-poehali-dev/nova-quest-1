import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const RECIPES_URL = "https://functions.poehali.dev/216eacc5-ff5d-4098-921c-c701944d3b55";
const CATEGORIES = ["Завтраки", "Обеды", "Ужины", "Перекусы"];

export default function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Завтраки",
    time: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    description: "",
    servings: "1",
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateList = (
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string
  ) => {
    const next = [...list];
    next[index] = value;
    setList(next);
  };

  const addItem = (list: string[], setList: (v: string[]) => void) =>
    setList([...list, ""]);

  const removeItem = (list: string[], setList: (v: string[]) => void, index: number) =>
    setList(list.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredSteps = steps.filter((s) => s.trim());

    if (!filteredIngredients.length || !filteredSteps.length) {
      setError("Добавьте хотя бы один ингредиент и один шаг");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(RECIPES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          calories: Number(form.calories),
          protein: Number(form.protein),
          fat: Number(form.fat),
          carbs: Number(form.carbs),
          servings: Number(form.servings),
          ingredients: filteredIngredients,
          steps: filteredSteps,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/recipes");
      } else {
        setError(data.error || "Ошибка при сохранении");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link to="/recipes" className="flex items-center gap-2 text-neutral-900 hover:text-neutral-600 transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm uppercase tracking-wide">Рецепты</span>
          </Link>
          <span className="text-sm uppercase tracking-wide text-neutral-400">Новый рецепт</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-10">
          ДОБАВИТЬ РЕЦЕПТ
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Основное</h2>
            <input
              required
              placeholder="Название рецепта"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-lg text-neutral-900 placeholder:text-neutral-300 transition-colors bg-transparent"
            />
            <textarea
              required
              placeholder="Краткое описание"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-base text-neutral-900 placeholder:text-neutral-300 transition-colors bg-transparent resize-none"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Категория</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Время</label>
                <input
                  required
                  placeholder="30 мин"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 placeholder:text-neutral-300 bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Порции</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.servings}
                  onChange={(e) => set("servings", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">КБЖУ (на порцию)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Калории", field: "calories", unit: "ккал" },
                { label: "Белки", field: "protein", unit: "г" },
                { label: "Жиры", field: "fat", unit: "г" },
                { label: "Углеводы", field: "carbs", unit: "г" },
              ].map(({ label, field, unit }) => (
                <div key={field}>
                  <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">{label}, {unit}</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form[field as keyof typeof form]}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Ингредиенты</h2>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-neutral-300 text-sm w-5 shrink-0">{i + 1}.</span>
                <input
                  placeholder={`Ингредиент ${i + 1}`}
                  value={ing}
                  onChange={(e) => updateList(ingredients, setIngredients, i, e.target.value)}
                  className="flex-1 border-b border-neutral-200 focus:border-neutral-900 outline-none py-2 text-neutral-900 placeholder:text-neutral-300 bg-transparent"
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeItem(ingredients, setIngredients, i)}>
                    <Icon name="X" size={14} className="text-neutral-300 hover:text-neutral-600" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(ingredients, setIngredients)}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors w-fit"
            >
              <Icon name="Plus" size={14} />
              Добавить ингредиент
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Приготовление</h2>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-3xl font-bold text-neutral-100 leading-none w-8 shrink-0 mt-1">{i + 1}</span>
                <textarea
                  placeholder={`Шаг ${i + 1}`}
                  value={step}
                  onChange={(e) => updateList(steps, setSteps, i, e.target.value)}
                  rows={2}
                  className="flex-1 border-b border-neutral-200 focus:border-neutral-900 outline-none py-2 text-neutral-900 placeholder:text-neutral-300 bg-transparent resize-none"
                />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeItem(steps, setSteps, i)} className="mt-2">
                    <Icon name="X" size={14} className="text-neutral-300 hover:text-neutral-600" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(steps, setSteps)}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors w-fit"
            >
              <Icon name="Plus" size={14} />
              Добавить шаг
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white border border-black px-8 py-4 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {loading ? "Сохраняю..." : "Опубликовать рецепт"}
          </button>
        </form>
      </div>
    </div>
  );
}
