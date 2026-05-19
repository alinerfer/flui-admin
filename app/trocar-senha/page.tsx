export default function TrocarSenhaPage() {
  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">Trocar senha</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        No primeiro acesso é necessário definir uma nova senha.
      </p>
      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nova senha</span>
          <input
            name="novaSenha"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Confirmar nova senha</span>
          <input
            name="confirmacao"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
