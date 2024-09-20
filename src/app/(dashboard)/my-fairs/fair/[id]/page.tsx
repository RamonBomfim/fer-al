"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Vendor {
  id: number;
  name: string;
}

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
  vendors: Vendor[];
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
    productTypes: "OTHERS",
    status: "",
    vendors: [],
  });

  useEffect(() => {
    async function fetchFair() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado.");
        }

        const response = await fetch("/api/user/fairs/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id: Number(id) }),
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar a feira.");
        }

        const data = await response.json();

        const treatDate = new Date(data.fair.date).toISOString().split("T")[0];
        setFair({ ...data.fair, date: treatDate });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFair();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFair({ ...fair, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { name, description, date, time, local, productTypes, status } =
        fair;

      const treatDate = new Date(date).toISOString();

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado.");
      }

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
          token,
          id: Number(id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Feira atualizada com sucesso.");
        router.push("/my-fairs");
      } else {
        setError("Erro ao atualizar a feira.");
      }
    } catch (error) {
      setError("Erro ao tentar atualizar a feira.");
    }
  };

  if (loading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-2/3 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Editar Feira
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Nome da feira
            </label>
            <input
              type="text"
              name="name"
              value={fair.name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={fair.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Data</label>
            <input
              type="date"
              name="date"
              value={fair.date || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Horário
            </label>
            <input
              type="time"
              name="time"
              value={fair.time || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Local
            </label>
            <input
              type="text"
              name="local"
              value={fair.local || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Tipo de produto vendido
            </label>
            <select
              name="productTypes"
              value={fair.productTypes || "OTHERS"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
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
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
