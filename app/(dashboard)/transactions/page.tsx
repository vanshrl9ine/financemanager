'use client';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNewTransaction } from '../../../features/transactions/hooks/use-new-transaction';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '../../../components/data-table';
import { useGetTransactions } from '../../../features/transactions/api/use-get-transactions';
import { Skeleton } from '../../../components/ui/skeleton';
import { useBulkDeleteTranasactions } from '../../../features/transactions/api/use-bulk-delete-transactions';
import { Input } from '../../../components/ui/input';
import { DatePicker } from '../../../components/date-picker';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { toast } from 'sonner';
import { transactions as transactionsSchema } from '../../../db/schema';
import { useSelectAccount } from '../../../features/accounts/hooks/use-select-account';
import { useBulkCreateTranasactions } from '../../../features/transactions/api/use-bulk-create-transactions';
enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
};

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};
const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
   const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
   const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
   const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log("Upload function called");
    console.log({ results });
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };
   const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTranasactions();
  const transactionsQuery=useGetTransactions();
  const transactions=transactionsQuery.data || [];
  const deleteTransactions=useBulkDeleteTranasactions() || []
  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

   // State for date filters
   const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
   const [toDate, setToDate] = useState<Date | undefined>(undefined);
 
   // Handle fromDate change
   const handleFromDateChange = (date: Date | undefined) => {
     if (date && toDate && date > toDate) {
       // If selected fromDate is greater than toDate, reset toDate
       setToDate(undefined);
     }
     setFromDate(date);
   };
 
   // Handle toDate change
   const handleToDateChange = (date: Date | undefined) => {
     if (date && fromDate && date < fromDate) {
       // If selected toDate is less than fromDate, reset fromDate
       setFromDate(undefined);
     }
     setToDate(date);
   };
 
   // Filter transactions based on dates
   const filteredTransactions = transactions.filter(transaction => {
     const transactionDate = new Date(transaction.date);
     const from = fromDate ? fromDate : null;
     const to = toDate ? toDate : null;
 
     return (!from || transactionDate >= from) && (!to || transactionDate <= to);
   });


  if(transactionsQuery.isLoading){
    return(
      <div className="max-w-screen-2xl mx-auto -mt-24 pb-10 w-full">
        <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className='h-8 w-48'/>
        </CardHeader>
            <CardContent>
        <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
           </CardContent>
        </Card>
       
      </div>
    )
  }
  if(variant===VARIANTS.IMPORT){
    return(
      <>
      <div>
        <AccountDialog/>
        <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport}/>
      </div>
      </>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10 w-full">
      
      <Card className="border-none drop-shadow-sm">
        
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">

          <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
          
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <DatePicker
              value={fromDate}
              onChange={handleFromDateChange}
              disabled={isDisabled}
            />
            <DatePicker
              value={toDate}
              onChange={handleToDateChange}
              disabled={isDisabled}
            />
            <Button size="sm" className='w-full lg:auto' onClick={newTransaction.onOpen}>
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload}/>
          </div>
        </CardHeader>
        
        <CardContent>
        <DataTable 
          columns={columns} 
          data={filteredTransactions} 
          filterKey='payee' 
          onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }} 
          disabled={isDisabled}/>
          
        </CardContent>
        
      </Card>
    </div>
  )
}

export default TransactionsPage