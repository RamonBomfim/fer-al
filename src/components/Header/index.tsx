"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum Role {
  visitante = "VISITANTE",
  organizador = "ORGANIZADOR",
  vendedor = "VENDEDOR",
  superuser = "SUPERUSER",
}

export function Header() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(Role.visitante);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      setLoading(true);
      setError(null);

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, []);

  const handleLogout = () => {
    // Remove o token JWT do cookie
    localStorage.removeItem("token");

    // Redireciona o usuário para a página de login
    router.push("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!role) return <p>No role data available</p>;

  return (
    <header className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/home" className="text-2xl font-bold">
            Meu App
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/home" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-gray-400">
              Profile
            </Link>
          </li>

          {role === Role.superuser && (
            <li>
              <Link href="/approvals" className="hover:text-gray-400">
                Solicitações
              </Link>
            </li>
          )}

          {role === Role.organizador && (
            <li>
              <Link href="/my-fairs" className="hover:text-gray-400">
                Minhas feiras
              </Link>
            </li>
          )}

          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-red-400"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
