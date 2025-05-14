
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
import { Search, Plus, Upload, Pencil, Trash2 } from 'lucide-react';
import { CheeseCategory, Product } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AssortmentPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<CheeseCategory>('Cow');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // CSV import state
  const [csvContent, setCsvContent] = useState<string>('');

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add product
  const handleAddProduct = () => {
    if (!newProductName.trim()) {
      return;
    }
    
    addProduct(newProductName.trim(), newProductCategory);
    setNewProductName('');
    setNewProductCategory('Cow');
    setAddDialogOpen(false);
  };
  
  // Handle edit product
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductCategory(product.category);
    setEditDialogOpen(true);
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct || !newProductName.trim()) {
      return;
    }
    
    updateProduct({
      ...editingProduct,
      name: newProductName.trim(),
      category: newProductCategory
    });
    
    setEditDialogOpen(false);
    setEditingProduct(null);
  };
  
  // Handle delete product
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteProduct = () => {
    if (!productToDelete) {
      return;
    }
    
    deleteProduct(productToDelete.id);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  
  // Handle CSV import
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };
  
  const handleImportCSV = () => {
    if (!csvContent) {
      toast.error('No CSV content to import');
      return;
    }
    
    // Split by newline and filter empty lines
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    
    // Import each line as a product
    let imported = 0;
    lines.forEach(line => {
      const productName = line.trim();
      if (productName) {
        addProduct(productName, 'Cow'); // Default category, can be changed later
        imported++;
      }
    });
    
    toast.success(`Imported ${imported} products`);
    setCsvContent('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assortment</h1>
        <div className="flex gap-2">
          <div>
            <input 
              type="file" 
              accept=".csv,.txt" 
              id="csv-upload" 
              className="hidden" 
              onChange={handleCSVUpload}
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span><Upload className="h-4 w-4 mr-2" /> Import CSV</span>
              </Button>
            </label>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>
      
      {csvContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CSV Import Preview</CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="mb-4">Found {csvContent.split(/\r?\n/).filter(line => line.trim() !== '').length} products in CSV.</p>
            <div className="flex gap-2">
              <Button onClick={handleImportCSV}>Import Products</Button>
              <Button variant="outline" onClick={() => setCsvContent('')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-12 text-base"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Assortment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getCategoryColor(product.category)
                        )}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(product)}
                          className="text-weidebio hover:text-weidebio-dark hover:bg-weidebio-50 mr-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClick(product)}
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
      
      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newProductCategory} onValueChange={(value) => setNewProductCategory(value as CheeseCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cow">Cow</SelectItem>
                  <SelectItem value="Goat">Goat</SelectItem>
                  <SelectItem value="Sheep">Sheep</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Plant-based">Plant-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-product-name">Product Name</Label>
              <Input
                id="edit-product-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={newProductCategory} onValueChange={(value) => setNewProductCategory(value as CheeseCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cow">Cow</SelectItem>
                  <SelectItem value="Goat">Goat</SelectItem>
                  <SelectItem value="Sheep">Sheep</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Plant-based">Plant-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
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

// Helper function to get category color
function getCategoryColor(category: CheeseCategory): string {
  switch(category) {
    case 'Cow':
      return 'bg-blue-100 text-blue-800';
    case 'Goat':
      return 'bg-green-100 text-green-800';
    case 'Sheep':
      return 'bg-purple-100 text-purple-800';
    case 'Mixed':
      return 'bg-amber-100 text-amber-800';
    case 'Plant-based':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
