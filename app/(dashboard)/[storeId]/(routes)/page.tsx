
import { Heading } from '../../../../components/heading';
import { Separator } from '../../../../components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Banknote } from "lucide-react";
import { formatter } from '../../../../lib/utils';
import { getTotalRevenue } from '../../../../actions/get-total-revenue';
import { getTotalSales } from '../../../../actions/get-total-sales';
import { getTotalProducts } from '../../../../actions/get-total-products';
import { getGraphTotalRevenue } from '../../../../actions/get-graph-total-revenue';
import { getOrderTotalRevenueByCategory } from '../../../../actions/get-graph-total-revenue-by-category';
import React from 'react';
import Overview from '../../../../components/overview';


interface DashboardOverviewProps{
    params: {storeId : string}
}


const DashboardOverview = async ({params} : DashboardOverviewProps) => {
  
    
    const totalRevenue = await getTotalRevenue(params.storeId);
    const totalSales = await getTotalSales(params.storeId);
    const totalProducts = await getTotalProducts(params.storeId);

    const monthlyGraphRevenue = await getGraphTotalRevenue(params.storeId);
    const revenueByCategory = await getOrderTotalRevenueByCategory(params.storeId);

    return (
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6 bg-white"> 
            <Heading title="Dashboard" description="Overview of your foodtruck" />
            <p className="text-sm text-muted-foreground">Control your foodtruck description and image and update your location at settings page!!</p>

            <Separator className="bg-purple-700" />
      
            <div className="grid gap-8 grid-cols-2 sm:grid-cols-3"> 
              <Card>
                <CardHeader className="flex items-center justify-between flex-row">
                  <CardTitle className="text-lg font-medium">
                    Total Revenue
                  </CardTitle>
                  <Banknote className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatter.format(totalRevenue)}
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex items-center justify-between flex-row">
                  <CardTitle className="text-lg font-medium">
                    Sales
                  </CardTitle>
                  <Banknote className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalSales}
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex items-center justify-between flex-row">
                  <CardTitle className="text-lg font-medium">
                    Products
                  </CardTitle>
                  <Banknote className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalProducts}
                  </div>
                </CardContent>
              </Card>
            </div>
                  <div className="grid gap-8 sm:grid-cols-2"> 

              <Card className="col-span-1">
                <CardHeader className="flex items-center justify-between flex-row">
                  <CardTitle className="text-lg font-medium">
                    Revenue by Month
                  </CardTitle>
                  <Banknote className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   <Overview data={monthlyGraphRevenue}/> 
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="flex items-center justify-between flex-row">
                  <CardTitle className="text-lg font-medium">
                    Revenue by Category
                  </CardTitle>
                  <Banknote className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   <Overview data={revenueByCategory}/>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
      
      
};
 
export default DashboardOverview;