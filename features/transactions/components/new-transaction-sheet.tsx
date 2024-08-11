import { Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle } from "../../../components/ui/sheet";
import { useNewTransaction } from "../hooks/use-new-transaction";

import { useCreateTransaction } from "../api/use-create-transaction";

import { z } from "zod";
import { insertTransactionSchema } from "../../../db/schema";
const formSchema = insertTransactionSchema.omit({
   id:true,
  });
  
  type FormValues = z.input<typeof formSchema>;
  
  export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction();
  
    const mutation = useCreateTransaction();
  
    const onSubmit = (values: FormValues) => {
      mutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    };
  
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Transaction</SheetTitle>
            <SheetDescription>
              Create a new Transaction.
            </SheetDescription>
          </SheetHeader>
          <p>Transaction form here</p>
        </SheetContent>
      </Sheet>
    );
  };