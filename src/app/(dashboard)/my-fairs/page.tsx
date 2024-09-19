"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  vendors: [];
}

export default function MyFairs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myFairs, setMyFairs] = useState<MyFairs[]>([]);
  const router = useRouter();

  const handleClickEdit = (id: number) => {
    router.push(`/my-fairs/fair/${id}`);
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

        const response = await fetch("/api/user/fairs", {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!myFairs) return <p>No approvals data available</p>;

  return (
    <div>
      <button type="button" onClick={() => router.push("/my-fairs/fair")}>
        Cadastrar nova feira
      </button>
      {myFairs.length > 0 ? (
        myFairs.map((fair) => {
          return (
            <div key={fair.id}>
              <h1>{fair.name}</h1>
              <p>{fair.description}</p>
              <p>{fair.date}</p>
              <p>{fair.time}</p>
              <p>{fair.local}</p>
              <p>{fair.status}</p>
              <p>{fair.productTypes}</p>
              <button
                onClick={() => handleClickEdit(fair.id)}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Editar
              </button>
            </div>
          );
        })
      ) : (
        <p>Você ainda não cadastrou feiras</p>
      )}
    </div>
  );
}
