"use client";

import { useParams } from "next/navigation";

export default function EditFair() {
  const { id } = useParams();

  return <div>{id}</div>;
}
