'use client';
import { UserButton } from "@clerk/nextjs";
import { useGetAccounts } from "../../features/accounts/api/use-get-accounts";
import { Button } from "../../components/ui/button";
import { useNewAccount } from "../../features/accounts/hooks/use-new-account";
export default function Home() {
 
  const {onOpen}=useNewAccount();
  return (
   <div>
      <Button onClick={onOpen}>
         Add a new Account
      </Button>
   </div>
  );
}
