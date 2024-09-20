"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Fair {
  name: string;
  description: string;
  date: string;
  time: string;
  local: string;
  productTypes: string;
  vendors: [];
}

export default function Fair() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fair, setFair] = useState<Fair>({
    name: "",
    description: "",
    date: "",
    time: "",
    local: "",
    productTypes: "OTHERS",
    vendors: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, description, date, time, local, productTypes, vendors } =
        fair;
      const treatDate = new Date(date).toISOString();

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Por favor, faça login novamente.");
        return;
      }

      const response = await fetch("/api/user/fairs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          date: treatDate,
          time,
          local,
          productTypes,
          vendors,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao tentar criar a feira.");
        return;
      }

      alert(data.message || "Feira criada com sucesso!");
      router.push("/my-fairs");
    } catch (error) {
      setError("Erro ao tentar criar a feira. Por favor, tente novamente.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFair({ ...fair, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-2/3 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Cadastrar Nova Feira
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Nome da Feira
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={fair.name}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Descrição
            </label>
            <input
              id="description"
              name="description"
              value={fair.description}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Data
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={fair.date}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Horário
              </label>
              <input
                id="time"
                type="time"
                name="time"
                value={fair.time}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="local"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Local
            </label>
            <input
              id="local"
              type="text"
              name="local"
              value={fair.local}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="productTypes"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Tipo de Produto Vendido
            </label>
            <select
              id="productTypes"
              name="productTypes"
              value={fair.productTypes}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ARTESANATO">Artesanato</option>
              <option value="ALIMENTOS">Alimentos</option>
              <option value="MODA">Moda</option>
              <option value="EVENTOS_CULTURAIS">Eventos Culturais</option>
              <option value="OTHERS">Outros</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Salvar Feira
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
