
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
import { CalendarIcon, MinusCircle, PlusCircle, Search, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Batch } from '@/types/types';

export default function InputPage() {
  const { products, batches, addBatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState<Date>(new Date());

  // Recent batches (show last 5)
  const recentBatches = batches.slice(0, 5);
  
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || quantity <= 0) {
      return;
    }
    
    // Add batch
    addBatch(selectedProduct, quantity, date.toISOString().split('T')[0]);
    
    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setDate(new Date());
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Input</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Batch</CardTitle>
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
                  onValueChange={setSelectedProduct}
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
              
              {/* Date Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mobile-friendly-input",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {date && (
                  <div className="text-sm text-muted-foreground">
                    Batch code: <span className="font-semibold">{format(date, "yyMM")}-{Math.ceil(date.getDate() / 7)}</span>
                  </div>
                )}
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
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="rounded-none border-x-0 text-center mobile-friendly-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none h-12 w-12"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button type="submit" className="w-full mobile-friendly-button">
                Add to Inventory
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Recent Batches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBatches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No recent batches found
                      </td>
                    </tr>
                  ) : (
                    recentBatches.map((batch: Batch) => (
                      <tr key={batch.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batchCode}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.productName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{format(new Date(batch.date), 'MMM d, yyyy')}</td>
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
