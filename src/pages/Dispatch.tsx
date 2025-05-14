
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MinusCircle, PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Dispatch } from '@/types/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function DispatchPage() {
  const { products, inventory, batches, dispatches, addDispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [dispatchType, setDispatchType] = useState<"Market" | "Wholesale">("Market");
  const [customer, setCustomer] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Get available batches for selected product
  const availableBatches = selectedProduct 
    ? inventory.filter(item => 
        item.productId === selectedProduct && 
        item.quantity > 0
      )
    : [];

  // Get max quantity for selected batch
  const maxQuantity = selectedBatch 
    ? inventory.find(item => item.batchId === selectedBatch)?.quantity || 0
    : 0;

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Recent dispatches (show last 5)
  const recentDispatches = dispatches.slice(0, 5);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedBatch || quantity <= 0 || quantity > maxQuantity) {
      return;
    }

    // Add dispatch
    addDispatch(selectedProduct, selectedBatch, quantity, dispatchType, dispatchType === "Wholesale" ? customer : undefined);
    
    // Reset form
    setSelectedProduct('');
    setSelectedBatch('');
    setDispatchType("Market");
    setCustomer('');
    setQuantity(1);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dispatch</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Dispatch</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Search and Select Product */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 mobile-friendly-input"
                  />
                </div>
                
                <Select
                  value={selectedProduct}
                  onValueChange={(value) => {
                    setSelectedProduct(value);
                    setSelectedBatch('');
                  }}
                >
                  <SelectTrigger className="mobile-friendly-input">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Select Batch */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch</label>
                <Select
                  value={selectedBatch}
                  onValueChange={setSelectedBatch}
                  disabled={availableBatches.length === 0}
                >
                  <SelectTrigger className="mobile-friendly-input">
                    <SelectValue placeholder={
                      availableBatches.length === 0 
                        ? "No batches available" 
                        : "Select batch"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((item) => (
                      <SelectItem key={item.batchId} value={item.batchId}>
                        {item.batchCode} - {item.quantity} units available
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none h-12 w-12"
                    disabled={!selectedBatch}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(value, maxQuantity));
                    }}
                    className="rounded-none border-x-0 text-center mobile-friendly-input"
                    disabled={!selectedBatch}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(quantity + 1, maxQuantity))}
                    className="rounded-l-none h-12 w-12"
                    disabled={!selectedBatch || quantity >= maxQuantity}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                {selectedBatch && (
                  <div className="text-sm text-muted-foreground">
                    Max available: {maxQuantity}
                  </div>
                )}
              </div>
              
              {/* Dispatch Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Dispatch Type</label>
                <RadioGroup 
                  value={dispatchType} 
                  onValueChange={(value) => setDispatchType(value as "Market" | "Wholesale")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Market" id="market" />
                    <Label htmlFor="market">Market</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Wholesale" id="wholesale" />
                    <Label htmlFor="wholesale">Wholesale</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Customer Name (for Wholesale) */}
              {dispatchType === "Wholesale" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer</label>
                  <Input
                    type="text"
                    placeholder="Customer name"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="mobile-friendly-input"
                    required
                  />
                </div>
              )}
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full mobile-friendly-button"
                disabled={!selectedBatch || quantity <= 0 || quantity > maxQuantity || (dispatchType === "Wholesale" && !customer)}
              >
                Create Dispatch
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Recent Dispatches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Dispatches</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentDispatches.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No recent dispatches found
                      </td>
                    </tr>
                  ) : (
                    recentDispatches.map((dispatch: Dispatch) => (
                      <tr key={dispatch.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{format(new Date(dispatch.date), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{dispatch.productName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{dispatch.batchCode}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{dispatch.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            dispatch.type === "Market" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-amber-100 text-amber-800"
                          )}>
                            {dispatch.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {dispatch.customer || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
