
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InventoryPage() {
  const { inventory, inventoryMutations, deleteBatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = (batchId: string) => {
    setBatchToDelete(batchId);
    setConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete);
      setConfirmDialog(false);
      setBatchToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Inventory</h1>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by product, category or batch code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-12 text-base"
        />
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="mutations">Recent Mutations</TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Code</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No inventory items found
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => (
                        <tr key={item.batchId}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.batchCode}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <span className={item.quantity < 10 ? "text-red-600 font-medium" : ""}>{item.quantity}</span>
                            {item.quantity < 10 && (
                              <AlertCircle className="inline-block ml-1 h-4 w-4 text-red-600" />
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{format(new Date(item.lastUpdated), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(item.batchId)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mutations Tab */}
        <TabsContent value="mutations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inventory Mutations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryMutations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No mutations found
                        </td>
                      </tr>
                    ) : (
                      inventoryMutations.map((mutation) => (
                        <tr key={mutation.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(mutation.date), 'MMM d, yyyy HH:mm')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{mutation.productName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              mutation.type === "In" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-blue-100 text-blue-800"
                            )}>
                              {mutation.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{mutation.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{mutation.user}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this batch? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
