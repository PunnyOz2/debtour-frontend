"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { AgencyType } from "./agencyType";
import AgencyCard from "./AgencyCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function AllRevenue() {
  const { data: session } = useSession();

  const getAllAgencies = async (): Promise<AgencyType[]> => {
    const token = session?.user?.serverToken;
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/agencies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const {
    data: agencies,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getAllAgencies(),
    queryKey: ["agencies"],
  });

  if (isLoading) {
    return (
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-bold text-red-500">
        Error: {error.message}
      </p>
    );
  }

  return (
    <main>
      <div className="container px-28">
        <div className="mb-20 mt-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">Agency Revenue Board</h1>
          <p className="text-gray-500">
            A comprehensive overview of the revenue generated by agency users
            within the system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {agencies &&
            agencies.map((agency: AgencyType) => (
              <AgencyCard key={agency.username} agency={agency} />
            ))}
        </div>
      </div>
    </main>
  );
}
