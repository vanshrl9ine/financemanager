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


const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const transactionsQuery=useGetTransactions();
  const transactions=transactionsQuery.data || [];
  const deleteTransactions=useBulkDeleteTranasactions() || []
  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Filter transactions based on dates
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

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
  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10 w-full">
      
      <Card className="border-none drop-shadow-sm">
        
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">

          <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
          
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From date"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To date"
            />
            <Button size="sm" onClick={newTransaction.onOpen}>
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
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