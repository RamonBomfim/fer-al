"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Fair {
  id: number;
  organizerId: number;
  name: string;
  description: string;
  date: string;
  time: string;
  local: string;
  productTypes: string;
  status: string;
  vendors: [];
}

export default function EditFair() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fair, setFair] = useState<Fair>({
    id: 0,
    organizerId: 0,
    name: "",
    description: "",
    date: "",
    time: "",
    local: "",
    productTypes: "",
    status: "",
    vendors: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const {
        name,
        description,
        date,
        time,
        local,
        productTypes,
        status,
        vendors,
      } = fair;

      const treatDate = new Date(date).toISOString();

      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/fairs/edit", {
        method: "PATCH",
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
          status,
          vendors,
          token,
          id: Number(id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Feira atualizada com sucesso");
        router.push("/my-fairs");
      } else {
        setError("Erro ao atualizar o feira");
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

  useEffect(() => {
    async function fetchMyFairs() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/user/fairs/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id: Number(id) }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        const treatDate = new Date(data.fair.date).toISOString().split("T")[0];

        data.fair.date = treatDate;

        setFair(data.fair);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching fairs:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyFairs();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!fair) return <p>No fair data available</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{fair.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nome da feira</label>
          <input
            type="text"
            name="name"
            value={fair.name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Descrição</label>
          <input
            type="text"
            name="description"
            value={fair.description || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={fair.date || ""}
            onChange={handleChange}
            className="w-full p-2 border text-black border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Horário</label>
          <input
            type="time"
            name="time"
            value={fair.time || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Local</label>
          <input
            type="text"
            name="local"
            value={fair.local || ""}
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
            value={fair.productTypes || "OTHERS"}
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
