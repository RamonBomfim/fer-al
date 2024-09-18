"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  storeName?: string;
  whatToSell?: string;
  partners?: string;
  cnpj?: string;
  keywords?: string;
  cpfOrCnpj?: string;
  vendor?: {
    id: number;
    userId: number;
    storeName?: string;
    whatSells?: string;
    partnerNames?: string;
    cnpj?: string;
    keywords?: string[];
  };
  organizer?: {
    id: number;
    userId: number;
    cpfOrCnpj?: string;
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/user/profile", {
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
        setProfile(data.user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    router.push("/profile/edit");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Informações Pessoais</h2>
        <p>
          <strong>Nome Completo:</strong> {profile.fullName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        {profile.role === "VENDEDOR" && (
          <>
            <p>
              <strong>Nome da Loja:</strong> {profile.vendor?.storeName}
            </p>
            <p>
              <strong>O que Vende:</strong> {profile.vendor?.whatSells}
            </p>
            <p>
              <strong>Nome dos Sócios:</strong> {profile.vendor?.partnerNames}
            </p>
            <p>
              <strong>CNPJ:</strong> {profile.vendor?.cnpj}
            </p>
            <p>
              <strong>Palavras-Chave:</strong>
              {profile.vendor?.keywords
                ?.map((keyword) => "#" + keyword)
                .join(", ")}
            </p>
          </>
        )}
        {profile.role === "ORGANIZADOR" && (
          <p>
            <strong>CNPJ ou CPF:</strong> {profile.organizer?.cpfOrCnpj}
          </p>
        )}
      </div>
      <button
        onClick={handleEditClick}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Editar Perfil
      </button>
    </div>
  );
}
