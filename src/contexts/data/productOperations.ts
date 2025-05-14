
import { Product, CheeseCategory } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function createProductOperations(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  batches: any[],
  setBatches: React.Dispatch<React.SetStateAction<any[]>>,
  setInventory: React.Dispatch<React.SetStateAction<any[]>>,
  setInventoryMutations: React.Dispatch<React.SetStateAction<any[]>>,
  setDispatches: React.Dispatch<React.SetStateAction<any[]>>,
  addActivity: (type: "Input" | "Dispatch" | "Edit" | "Delete", description: string) => void
) {
  const addProduct = (name: string, category: CheeseCategory) => {
    const newProduct = {
      id: uuidv4(),
      name,
      category
    };
    
    setProducts(prev => [newProduct, ...prev]);
    
    // Add activity
    addActivity("Edit", `Added new product: ${name}`);
    
    toast.success(`Added new product: ${name}`);
  };
  
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    
    // Update product name in batches, inventory, etc.
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    
    if (oldProduct && oldProduct.name !== updatedProduct.name) {
      // Update batches
      setBatches(prev => 
        prev.map(batch => 
          batch.productId === updatedProduct.id 
            ? { ...batch, productName: updatedProduct.name, category: updatedProduct.category }
            : batch
        )
      );
      
      // Update inventory
      setInventory(prev => 
        prev.map(item => 
          item.productId === updatedProduct.id 
            ? { ...item, productName: updatedProduct.name, category: updatedProduct.category }
            : item
        )
      );
      
      // Update mutations
      setInventoryMutations(prev => 
        prev.map(mutation => 
          mutation.productId === updatedProduct.id 
            ? { ...mutation, productName: updatedProduct.name }
            : mutation
        )
      );
      
      // Update dispatches
      setDispatches(prev => 
        prev.map(dispatch => 
          dispatch.productId === updatedProduct.id 
            ? { ...dispatch, productName: updatedProduct.name }
            : dispatch
        )
      );
      
      // Add activity
      addActivity("Edit", `Updated product: ${oldProduct.name} → ${updatedProduct.name}`);
      
      toast.success(`Updated product: ${updatedProduct.name}`);
    }
  };
  
  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    // Check if product is used in batches
    const usedInBatches = batches.some(batch => batch.productId === id);
    
    if (usedInBatches) {
      toast.error(`Cannot delete ${productToDelete.name} as it is used in batches`);
      return;
    }
    
    setProducts(prev => prev.filter(product => product.id !== id));
    
    // Add activity
    addActivity("Delete", `Removed product: ${productToDelete.name}`);
    
    toast.success(`Deleted product: ${productToDelete.name}`);
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct
  };
}
