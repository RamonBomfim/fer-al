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
      const response = await fetch("/api/user/fairs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          date: treatDate,
          time,
          local,
          productTypes,
          vendors,
          token,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.success);
        router.push("/my-fairs");
      } else {
        setError("Erro ao tentar criar a feira");
      }
    } catch (error) {
      setError("Erro ao tentar atualizar feira");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFair({ ...fair, [e.target.name]: e.target.value });
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nova feira</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nome da feira</label>
          <input
            type="text"
            name="name"
            value={fair.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Descrição</label>
          <input
            type="text"
            name="description"
            value={fair.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={fair.date}
            onChange={handleChange}
            className="w-full p-2 border text-black border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Horário</label>
          <input
            type="time"
            name="time"
            value={fair.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Local</label>
          <input
            type="text"
            name="local"
            value={fair.local}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Tipo de produto vendido
          </label>
          <select
            name="productTypes"
            value={fair.productTypes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="ARTESANATO">Artesanato</option>
            <option value="ALIMENTOS">Alimentos</option>
            <option value="MODA">Moda</option>
            <option value="EVENTOS_CULTURAIS">Eventos Culturais</option>
            <option value="OTHERS">Outros</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
