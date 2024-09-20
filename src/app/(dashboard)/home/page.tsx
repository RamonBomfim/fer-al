"use client";
import Ilustration from "@/app/assets/undraw_fans_re_cri3.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

const productTypes = [
  { label: "Artesanato", value: "ARTESANATO" },
  { label: "Alimentos", value: "ALIMENTOS" },
  { label: "Moda", value: "MODA" },
  { label: "Eventos Culturais", value: "EVENTOS_CULTURAIS" },
  { label: "Outros", value: "OTHERS" },
];

interface ProductTypes {
  type: "ARTESANATO" | "ALIMENTOS" | "MODA" | "EVENTOS_CULTURAIS" | "OTHERS";
}

interface Vendors {
  id: number;
  userId: number;
  storeName: string;
  whatSells: string;
  partnerNames?: string;
  cnpj: string;
  keywords: string[];
}

interface Organizer {
  id: number;
  userId: number;
  cpfOrCnpj: string;
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
  vendors: Vendors[];
  organizer: Organizer;
}

enum Role {
  visitante = "VISITANTE",
  organizador = "ORGANIZADOR",
  vendedor = "VENDEDOR",
  superuser = "SUPERUSER",
}

export default function FairList() {
  const [loading, setLoading] = useState(true);
  const [selectedProductTypes, setSelectedProductTypes] =
    useState<ProductTypes | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [fairs, setFairs] = useState<MyFairs[]>([]);
  const [role, setRole] = useState<Role>(Role.visitante);

  const fetchFairs = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/user/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productTypes: selectedProductTypes?.type ?? "",
          date: selectedDate,
          location: selectedLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setFairs(data.fairs || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Nenhuma feira encontrada com esse filtro");
    } finally {
      setLoading(false);
    }
  };

  async function fetchRole() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setRole(data.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
    }
  }

  async function handleSubscribe(fairId: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/user/fairs/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fairId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inscrição realizada com sucesso!");
      } else {
        alert(data.message || "Erro ao realizar inscrição.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error subscribing to fair:", error.message);
    }
  }

  // Busca todas as feiras de hoje e futuras no início
  useEffect(() => {
    fetchFairs();
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!fairs) return <p>No fairs data available</p>;

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
        Feiras por Categoria
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
        <select
          value={selectedProductTypes?.type ?? ""}
          onChange={(e) => {
            setSelectedProductTypes({
              type: e.target.value as ProductTypes["type"],
            });
          }}
          className="border p-2 mr-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma categoria</option>
          {productTypes.map((product) => (
            <option key={product.value} value={product.value}>
              {product.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 mr-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Local"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border p-2 mr-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchFairs}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fairs.length ? (
          fairs.map((fair) => (
            <div
              key={fair.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                <Image
                  src={Ilustration}
                  alt="Imagem da feira"
                  className="object-cover w-full h-40 rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  {fair.name}
                </h2>
                <p className="text-gray-700 mb-4">{fair.description}</p>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(fair.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Horário:</span> {fair.time}
                  </p>
                  <p>
                    <span className="font-medium">Local:</span> {fair.local}
                  </p>
                  <p className="font-medium">
                    Tipo de Produtos:{" "}
                    <span className="font-normal capitalize">
                      {fair.productTypes === "EVENTOS_CULTURAIS"
                        ? "Eventos culturais"
                        : fair.productTypes.toLowerCase()}
                    </span>
                  </p>
                </div>
                {role === Role.vendedor && (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
                    onClick={() => handleSubscribe(fair.id)}
                  >
                    Inscrever-se
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-700">
            Nenhuma feira encontrada para esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}
