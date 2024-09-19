"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Armazena o token em um cookie (pode ser ajustado para sua configuração específica)
        localStorage.setItem("token", result.token);
        router.push("/home");
      } else {
        alert(result.message || "Erro ao fazer login");
      }
    } catch (error) {
      alert("Erro de rede");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Faça seu login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-base font-medium text-[#caf0f8]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[#03045e]"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-base font-medium text-[#caf0f8]"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[#03045e]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#03045e] text-[#CAF0F8] p-2 rounded-md"
        >
          Login
        </button>
      </form>
      <p className="text-base text-[#CAF0F8] mt-2">
        Ainda não tem uma conta?{" "}
        <Link href="/register" className="text-base font-bold hover:underline">
          Clique aqui
        </Link>
      </p>
    </div>
  );
}
