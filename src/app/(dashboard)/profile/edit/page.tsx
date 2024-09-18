"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  storeName?: string;
  whatSells?: string;
  partnerNames?: string;
  cnpj?: string;
  keywords: string[];
  cpfOrCnpj?: string;
}

export default function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    email: "",
    role: "VISITANTE",
    storeName: "",
    whatSells: "",
    partnerNames: "",
    cnpj: "",
    keywords: [],
    cpfOrCnpj: "",
  });
  const [newKeyword, setNewKeyword] = useState("");
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
        setFormData((prev) => ({
          ...prev,
          ...data.user,
          keywords: data.user?.keywords || [],
        }));
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddKeyword = () => {
    if (
      newKeyword &&
      Array.isArray(formData.keywords) &&
      !formData.keywords.includes(newKeyword)
    ) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, token }),
      });

      if (response.ok) {
        router.push("/profile");
      } else {
        setError("Erro ao atualizar o perfil");
      }
    } catch (error) {
      setError("Erro ao enviar a solicitação");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Perfil não encontrado</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nome Completo</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Role</label>
          <select
            name="role"
            value={formData.role || "VISITANTE"}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="VISITANTE">Visitante</option>
            <option value="VENDEDOR">Vendedor</option>
            <option value="ORGANIZADOR">Organizador</option>
          </select>
        </div>

        {formData.role === "VENDEDOR" && (
          <>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Nome da Loja</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                O que você vende?
              </label>
              <input
                type="text"
                name="whatSells"
                value={formData.whatSells || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Palavras-chave</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Adicionar palavra-chave"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {Array.isArray(formData.keywords) &&
                formData.keywords.length > 0 ? (
                  formData.keywords.map((keyword) => (
                    <li
                      key={keyword}
                      className="flex justify-between items-center bg-gray-200 p-2 rounded-md mb-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-red-500"
                      >
                        Remover
                      </button>
                    </li>
                  ))
                ) : (
                  <p>Nenhuma palavra-chave adicionada</p>
                )}
              </ul>
            </div>
          </>
        )}

        {formData.role === "ORGANIZADOR" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">CPF ou CNPJ</label>
            <input
              type="text"
              name="cpfOrCnpj"
              value={formData.cpfOrCnpj || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

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
