import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Recipe } from "@/data/recipes";

const RECIPES_URL = "https://functions.poehali.dev/216eacc5-ff5d-4098-921c-c701944d3b55";
const UPLOAD_URL = "https://functions.poehali.dev/d465f8e5-965b-4e7d-b38b-e452d133823a";
const CATEGORIES = ["Завтраки", "Обеды", "Ужины", "Перекусы"];

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = id?.replace("user_", "");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    title: "", category: "Завтраки", time: "",
    calories: "", protein: "", fat: "", carbs: "",
    description: "", servings: "1",
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  useEffect(() => {
    fetch(RECIPES_URL)
      .then((r) => r.json())
      .then((data) => {
        const recipe: Recipe = (data.recipes || []).find((r: Recipe) => r.id === id);
        if (recipe) {
          setForm({
            title: recipe.title,
            category: recipe.category,
            time: recipe.time,
            calories: String(recipe.calories),
            protein: String(recipe.protein),
            fat: String(recipe.fat),
            carbs: String(recipe.carbs),
            description: recipe.description,
            servings: String(recipe.servings),
          });
          setIngredients(recipe.ingredients.length ? recipe.ingredients : [""]);
          setSteps(recipe.steps.length ? recipe.steps : [""]);
          setImageUrl(recipe.image || "");
          if (recipe.image) setImagePreview(recipe.image);
        } else {
          setError("Рецепт не найден");
        }
      })
      .catch(() => setError("Ошибка загрузки"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const updateList = (list: string[], setList: (v: string[]) => void, i: number, val: string) => {
    const next = [...list]; next[i] = val; setList(next);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(",")[1];
      setImagePreview(ev.target?.result as string);
      setImageUploading(true);
      try {
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, contentType: file.type }),
        });
        const data = await res.json();
        if (res.ok) setImageUrl(data.url);
        else setError("Ошибка загрузки фото");
      } catch {
        setError("Ошибка загрузки фото");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredSteps = steps.filter((s) => s.trim());
    if (!filteredIngredients.length || !filteredSteps.length) {
      setError("Добавьте хотя бы один ингредиент и шаг");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${RECIPES_URL}/${numericId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          calories: Number(form.calories),
          protein: Number(form.protein),
          fat: Number(form.fat),
          carbs: Number(form.carbs),
          servings: Number(form.servings),
          ingredients: filteredIngredients,
          steps: filteredSteps,
        }),
      });
      if (res.ok) navigate(`/recipes/${id}`);
      else setError("Ошибка при сохранении");
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm uppercase tracking-wide">
        Загружаю...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link to={`/recipes/${id}`} className="flex items-center gap-2 text-neutral-900 hover:text-neutral-600 transition-colors">
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm uppercase tracking-wide">Назад</span>
          </Link>
          <span className="text-sm uppercase tracking-wide text-neutral-400">Редактирование</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-10">
          РЕДАКТИРОВАТЬ
        </h1>

        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Основное</h2>

            <div>
              <label className="text-xs text-neutral-400 uppercase tracking-wide mb-2 block">Фото блюда</label>
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="relative h-56 overflow-hidden">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    {imageUploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-sm text-neutral-500 uppercase tracking-wide">Загружаю...</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black text-white text-xs px-3 py-1 uppercase tracking-wide">
                      Изменить фото
                    </div>
                  </div>
                ) : (
                  <div className="h-56 border border-dashed border-neutral-200 flex flex-col items-center justify-center gap-3 hover:border-neutral-400 transition-colors">
                    <Icon name="ImagePlus" size={32} className="text-neutral-300" />
                    <span className="text-sm text-neutral-400 uppercase tracking-wide">Загрузить фото</span>
                  </div>
                )}
              </label>
            </div>

            <input required placeholder="Название рецепта" value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-lg text-neutral-900 placeholder:text-neutral-300 transition-colors bg-transparent" />
            <textarea required placeholder="Краткое описание" value={form.description}
              onChange={(e) => set("description", e.target.value)} rows={2}
              className="border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-base text-neutral-900 placeholder:text-neutral-300 transition-colors bg-transparent resize-none" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Категория</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Время</label>
                <input required placeholder="30 мин" value={form.time} onChange={(e) => set("time", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 placeholder:text-neutral-300 bg-transparent" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 uppercase tracking-wide mb-1 block">Порции</label>
                <input required type="number" min="1" value={form.servings} onChange={(e) => set("servings", e.target.value)}
                  className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent" />
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
                  <input required type="number" min="0" value={form[field as keyof typeof form]}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 text-neutral-900 bg-transparent" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Ингредиенты</h2>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-neutral-300 text-sm w-5 shrink-0">{i + 1}.</span>
                <input placeholder={`Ингредиент ${i + 1}`} value={ing}
                  onChange={(e) => updateList(ingredients, setIngredients, i, e.target.value)}
                  className="flex-1 border-b border-neutral-200 focus:border-neutral-900 outline-none py-2 text-neutral-900 placeholder:text-neutral-300 bg-transparent" />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}>
                    <Icon name="X" size={14} className="text-neutral-300 hover:text-neutral-600" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setIngredients([...ingredients, ""])}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors w-fit">
              <Icon name="Plus" size={14} /> Добавить ингредиент
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">Приготовление</h2>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-3xl font-bold text-neutral-100 leading-none w-8 shrink-0 mt-1">{i + 1}</span>
                <textarea placeholder={`Шаг ${i + 1}`} value={step}
                  onChange={(e) => updateList(steps, setSteps, i, e.target.value)} rows={2}
                  className="flex-1 border-b border-neutral-200 focus:border-neutral-900 outline-none py-2 text-neutral-900 placeholder:text-neutral-300 bg-transparent resize-none" />
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="mt-2">
                    <Icon name="X" size={14} className="text-neutral-300 hover:text-neutral-600" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setSteps([...steps, ""])}
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors w-fit">
              <Icon name="Plus" size={14} /> Добавить шаг
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading || imageUploading}
            className="bg-black text-white border border-black px-8 py-4 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed w-fit">
            {loading ? "Сохраняю..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </div>
  );
}
