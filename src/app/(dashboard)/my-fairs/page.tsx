"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Vendor {
  id: number;
  name: string;
}

interface MyFairs {
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

export default function MyFairs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myFairs, setMyFairs] = useState<MyFairs[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchMyFairs() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/user/fairs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch fairs");
        }

        const data = await response.json();
        setMyFairs(data.myFairs);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching fairs:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyFairs();
  }, []);

  const handleClickEdit = (id: number) => {
    router.push(`/my-fairs/fair/${id}`);
  };

  const handleCreateFair = () => {
    router.push("/my-fairs/fair");
  };

  if (loading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!myFairs || myFairs.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-gray-500 mb-4">Você ainda não cadastrou feiras.</p>
        <button
          onClick={handleCreateFair}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Cadastrar nova feira
        </button>
      </div>
    );

  return (
    <div className="min-h-screen w-2/3 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Minhas Feiras</h1>
          <button
            onClick={handleCreateFair}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Cadastrar nova feira
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myFairs.map((fair) => (
            <div
              key={fair.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {fair.name}
              </h2>
              <p className="text-gray-600 mb-2">{fair.description}</p>
              <p className="text-gray-500 text-sm mb-2">
                Data: {new Date(fair.date).toLocaleDateString("pt-BR")} às{" "}
                {fair.time}
              </p>
              <p className="text-gray-500 text-sm mb-4">Local: {fair.local}</p>
              <p className="text-gray-500 text-sm mb-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    fair.status === "DELAYED"
                      ? "text-yellow-500"
                      : fair.status === "HAPPENED"
                      ? "text-green-500"
                      : fair.status === "COMING"
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {fair.status === "DELAYED"
                    ? "Adiada"
                    : fair.status === "HAPPENED"
                    ? "Acontecendo"
                    : fair.status === "COMING"
                    ? "Em breve"
                    : "Cancelada"}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Tipos de Produtos:{" "}
                <span className="capitalize">
                  {fair.productTypes === "EVENTOS_CULTURAIS"
                    ? "Eventos Culturais"
                    : fair.productTypes.toLowerCase()}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {fair.vendors.length > 0
                  ? `Vendedores Confirmados: ${fair.vendors
                      .map((vendor) => vendor.name)
                      .join(", ")}`
                  : "Nenhum vendedor confirmado ainda"}
              </p>
              <button
                onClick={() => handleClickEdit(fair.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
