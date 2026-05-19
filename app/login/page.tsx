export default function LoginPage() {
  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>
      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Usuário</span>
          <input
            name="usuario"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Senha</span>
          <input
            name="senha"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
