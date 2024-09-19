// src/app/register/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    if (!acceptTerms) {
      alert("Você deve aceitar os termos");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          acceptTerms,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/");
      } else {
        alert(result.message || "Erro ao registrar");
      }
    } catch (error) {
      alert("Erro de rede");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-base font-medium text-[#caf0f8]"
          >
            Nome Completo
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[#03045e]"
            required
          />
        </div>
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
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-base font-medium text-[#caf0f8]"
          >
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[#03045e]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="form-checkbox"
              required
            />
            <span className="ml-2">
              Eu aceito os termos de uso e privacidade
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-[#03045e] text-[#CAF0F8] p-2 rounded-md"
        >
          Registrar
        </button>
      </form>

      <p className="text-base text-[#CAF0F8] mt-2">
        Já tem uma conta?{" "}
        <Link href="/" className="text-base font-bold hover:underline">
          Faça login
        </Link>
      </p>
    </div>
  );
}
