"use client";
import { useEffect, useState } from "react";

interface Approvals {
  id: number;
  fullName: string;
  email: string;
  role: string;
  approvalRequests: {
    id: number;
    userId: number;
    requestedRole: string;
    cpfOrCnpj: string;
    status: string;
  }[];
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approvals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEditApproval = async (req: {
    id: number;
    status: string;
    userId: number;
    cpfOrCnpj: string;
  }) => {
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/user/approvals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, ...req }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (data.success) {
        setApprovals((prev) =>
          prev.map((approval) =>
            approval.id === req.userId
              ? { ...approval, role: "ORGANIZADOR" }
              : approval
          )
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    async function fetchApprovals() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/user/approvals", {
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
        setApprovals(data.approvals);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApprovals();
  }, []);

  if (loading) return <p className="text-center py-4">Carregando...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;
  if (!approvals || approvals.length === 0)
    return (
      <p className="text-center py-4">
        Nenhuma solicitação de aprovação disponível
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Solicitações de Aprovação
      </h1>
      {approvals.map((approval) => {
        if (approval.role !== "ORGANIZADOR") {
          const request = approval.approvalRequests[0];
          return (
            <div
              key={approval.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border"
            >
              <h2 className="text-xl font-semibold mb-2 text-black">
                {approval.fullName}
              </h2>
              <p className="text-black mb-1">Email: {approval.email}</p>
              <p className="text-black mb-1">
                CPF ou CNPJ: {request.cpfOrCnpj}
              </p>
              <p className="text-black mb-1">
                Papel Requisitado: {request.requestedRole}
              </p>
              <p
                className={`mb-2 ${
                  request.status === "PENDING"
                    ? "text-yellow-500"
                    : request.status === "APPROVED"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {request.status}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    handleEditApproval({
                      status: "APPROVED",
                      id: request.id,
                      userId: approval.id,
                      cpfOrCnpj: request.cpfOrCnpj,
                    })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Aprovar solicitação
                </button>
                <button
                  onClick={() =>
                    handleEditApproval({
                      status: "REJECTED",
                      id: request.id,
                      userId: approval.id,
                      cpfOrCnpj: request.cpfOrCnpj,
                    })
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Recusar solicitação
                </button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
