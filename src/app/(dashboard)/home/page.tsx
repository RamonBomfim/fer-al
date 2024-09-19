"use client";
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

export default function FairList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductTypes, setSelectedProductTypes] =
    useState<ProductTypes | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [fairs, setFairs] = useState<MyFairs[]>([]);

  const fetchFairs = async () => {
    setLoading(true);
    setError(null);

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
      console.error("Error fetching fairs:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Busca todas as feiras de hoje e futuras no início
  useEffect(() => {
    fetchFairs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!fairs) return <p>No fairs data available</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feiras por Categoria</h1>

      <div className="mb-4">
        <select
          value={selectedProductTypes?.type ?? ""}
          onChange={(e) => {
            setSelectedProductTypes({
              type: e.target.value as ProductTypes["type"],
            });
          }}
          className="border p-2 mr-2"
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
          className="border p-2 mr-2"
        />

        <input
          type="text"
          placeholder="Local"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={fetchFairs}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fairs.length ? (
          fairs.map((fair) => (
            <div key={fair.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{fair.name}</h2>
              <p>{fair.description}</p>
              <p>
                <span className="font-bold">Data:</span>{" "}
                {new Date(fair.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Horário:</span> {fair.time}
              </p>
              <p>
                <span className="font-bold">Local:</span> {fair.local}
              </p>
              <p>
                <span className="font-bold">Tipo de Produtos:</span>{" "}
                {fair.productTypes}
              </p>
              {/* Exibe os vendedores da feira, se houver */}
              {fair.vendors.length > 0 && (
                <ul>
                  {fair.vendors.map((vendor) => (
                    <li key={vendor.userId}>{vendor.storeName}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p>Nenhuma feira encontrada para esses filtros.</p>
        )}
      </div>
    </div>
  );
}
