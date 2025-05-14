
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Orders</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders Feature</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600">
            The Orders feature is coming soon. This page will allow you to track customer orders,
            manage order fulfillment, and link orders to dispatches.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
