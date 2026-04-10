import { useNavigate } from "react-router-dom";

export default function Featured() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="https://cdn.poehali.dev/projects/81a593ec-d3d5-478e-8d20-b52f799fce48/files/9bef80b1-e3dc-4100-8887-d207b81ed662.jpg"
          alt="Healthy meal prep"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Правильное питание — это просто</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          Сотни проверенных рецептов с подсчётом калорий, КБЖУ и пошаговыми инструкциями. Готовь вкусно, питайся осознанно и чувствуй себя на все 100.
        </p>
        <button
          onClick={() => navigate("/recipes")}
          className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide"
        >
          Смотреть рецепты
        </button>
      </div>
    </div>
  );
}