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
        const updatedApprovals = [...approvals];
        const updated = updatedApprovals.filter(
          (approval) => approval.id === req.userId
        );
        updated[0].role = "ORGANIZADOR";

        setApprovals((prev) =>
          prev.map((approval) =>
            approval.id === req.userId ? updated[0] : approval
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!approvals) return <p>No approvals data available</p>;

  return (
    <div>
      {approvals.map((approvals) => {
        if (approvals.role !== "ORGANIZADOR") {
          return (
            <div key={approvals.id}>
              <p>{approvals.fullName}</p>
              <p>{approvals.email}</p>
              <p>{approvals.approvalRequests[0].cpfOrCnpj}</p>
              <p>{approvals.approvalRequests[0].requestedRole}</p>
              <p>{approvals.approvalRequests[0].status}</p>
              <button
                onClick={() =>
                  handleEditApproval({
                    status: "approve",
                    id: approvals.approvalRequests[0].id,
                    userId: approvals.id,
                    cpfOrCnpj: approvals.approvalRequests[0].cpfOrCnpj,
                  })
                }
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Aprovar solicitação
              </button>
              <button
                onClick={() =>
                  handleEditApproval({
                    status: "reject",
                    id: approvals.approvalRequests[0].id,
                    userId: approvals.id,
                    cpfOrCnpj: approvals.approvalRequests[0].cpfOrCnpj,
                  })
                }
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Recusar solicitação
              </button>
            </div>
          );
        }
      })}
    </div>
  );
}
