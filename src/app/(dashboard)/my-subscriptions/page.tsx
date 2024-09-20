"use client";
import Ilustration from "@/app/assets/undraw_fans_re_cri3.svg";
import Image from "next/image";
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
}

interface MySubscriptions {
  fairId: number;
  vendorId: number;
  fairs: Fair[];
}

export default function MySubscriptions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mySubscriptions, setMySubscriptions] = useState<MySubscriptions>({
    fairId: 0,
    vendorId: 0,
    fairs: [],
  });

  useEffect(() => {
    async function fetchMySubscriptions() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "/api/user/fairs/subscribe/my-subscriptions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data);
        setMySubscriptions(data.subscriptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching fairs:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMySubscriptions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mySubscriptions) return <p>No subscriptions data available</p>;

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Minhas Inscrições
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mySubscriptions.fairs.length ? (
          mySubscriptions.fairs.map((fair) => (
            <div
              key={fair.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="relative w-full h-36">
                <Image
                  src={Ilustration}
                  alt="Ilustração aleatória"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
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
                  <p>
                    <span className="font-medium">Tipo de Produtos:</span>{" "}
                    {fair.productTypes}
                  </p>
                </div>
              </div>
              {/* 
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => handleSubscribe(fair.id)}
              >
                {role === Role.vendedor ? "Inscrever-se" : "Tenho interesse"}
              </button> */}
            </div>
          ))
        ) : (
          <p>Nenhuma feira encontrada para esses filtros.</p>
        )}
      </div>
    </div>
  );
}
