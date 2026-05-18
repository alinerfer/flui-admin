import Link from "next/link";

export default function NovoPontoPage() {
  return (
    <div className="p-8">
      <Link href="/pontos" className="text-sm text-emerald-700 hover:underline">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Novo ponto de recarga</h1>

      <form className="flex flex-col gap-4 max-w-md">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nome</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Endereço</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Cidade</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">UF</span>
          <input
            type="text"
            maxLength={2}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Conector</span>
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla">Tesla</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Potência (kW)</span>
          <input
            type="number"
            step="0.1"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Preço por kWh (R$)</span>
          <input
            type="number"
            step="0.01"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Latitude</span>
          <input
            type="number"
            step="any"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Longitude</span>
          <input
            type="number"
            step="any"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
