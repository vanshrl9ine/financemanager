'use client';
import { UserButton } from "@clerk/nextjs";
import { useGetAccounts } from "../../features/accounts/api/use-get-accounts";
export default function Home() {
  const accountsQuery=useGetAccounts();
  return (
   <div>
   
dashboard
   </div>
  );
}
