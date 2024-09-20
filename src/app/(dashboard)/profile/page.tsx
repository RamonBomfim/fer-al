"use client";
import AvatarImg from "@/app/assets/undraw_pic_profile_re_7g2h.svg";
import Image from "next/image";
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
    <div className="flex flex-col flex-1 gap-4 items-center pt-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Meu Perfil
      </h1>
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <Image
              src={AvatarImg}
              alt="Imagem de avatar de perfil"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.fullName}
            </h1>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Informações Pessoais
          </h2>
          <div className="space-y-2">
            <p>
              <strong className="text-gray-600">Role:</strong>{" "}
              <span className="text-gray-800">{profile.role}</span>
            </p>
            {profile.role === "VENDEDOR" && (
              <>
                <p>
                  <strong className="text-gray-600">Nome da Loja:</strong>{" "}
                  <span className="text-gray-800">
                    {profile.vendor?.storeName}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">O que Vende:</strong>{" "}
                  <span className="text-gray-800">
                    {profile.vendor?.whatSells}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">Nome dos Sócios:</strong>{" "}
                  <span className="text-gray-800">
                    {profile.vendor?.partnerNames}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">CNPJ:</strong>{" "}
                  <span className="text-gray-800">{profile.vendor?.cnpj}</span>
                </p>
                <p>
                  <strong className="text-gray-600">Palavras-Chave:</strong>{" "}
                  <span className="text-gray-800">
                    {profile.vendor?.keywords
                      ?.map((keyword) => "#" + keyword)
                      .join(", ")}
                  </span>
                </p>
              </>
            )}
            {profile.role === "ORGANIZADOR" && (
              <p>
                <strong className="text-gray-600">CNPJ ou CPF:</strong>{" "}
                <span className="text-gray-800">
                  {profile.organizer?.cpfOrCnpj}
                </span>
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleEditClick}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
}
