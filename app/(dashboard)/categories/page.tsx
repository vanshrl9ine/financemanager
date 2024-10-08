'use client';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNewCategory } from '../../../features/categories/hooks/use-new-category';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '../../../components/data-table';
import { useGetCategory } from '../../../features/categories/api/use-get-category';
import { Skeleton } from '../../../components/ui/skeleton';
import { useBulkDeleteCategories } from '../../../features/categories/api/use-bulk-delete-categories';
import { useGetCategories } from '../../../features/categories/api/use-get-categories';


const CategoriesPage = () => {
  const newCategory = useNewCategory();
  const categoriesQuery=useGetCategories();
  const categories=categoriesQuery.data || [];
  const deleteCategories=useBulkDeleteCategories() || []
  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if(categoriesQuery.isLoading){
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
          <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
        <DataTable 
          columns={columns} 
          data={categories} 
          filterKey='name' 
          onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
            }} 
          disabled={isDisabled}/>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesPage