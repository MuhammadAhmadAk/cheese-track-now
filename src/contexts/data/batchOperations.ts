
import { Batch, Product } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function createBatchOperations(
  products: Product[],
  batches: Batch[],
  dispatches: any[],
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>,
  setInventory: React.Dispatch<React.SetStateAction<any[]>>,
  setInventoryMutations: React.Dispatch<React.SetStateAction<any[]>>,
  generateBatchCode: (date?: Date) => string,
  addActivity: (type: "Input" | "Dispatch" | "Edit" | "Delete", description: string) => void
) {
  const addBatch = (productId: string, quantity: number, date?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const batchDate = date ? new Date(date) : new Date();
    const batchCode = generateBatchCode(batchDate);
    
    const newBatch: Batch = {
      id: uuidv4(),
      batchCode,
      productId,
      productName: product.name,
      category: product.category,
      quantity,
      date: batchDate.toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    setBatches(prev => [newBatch, ...prev]);
    
    // Update inventory
    const newInventory = {
      productId,
      productName: product.name,
      category: product.category,
      batchId: newBatch.id,
      batchCode,
      quantity,
      lastUpdated: new Date().toISOString()
    };
    
    setInventory(prev => [newInventory, ...prev]);
    
    // Add inventory mutation
    const newMutation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productId,
      productName: product.name,
      quantity,
      type: "In",
      user: "System"
    };
    
    setInventoryMutations(prev => [newMutation, ...prev]);
    
    // Add activity
    addActivity("Input", `Added ${quantity} units of ${product.name} (Batch: ${batchCode})`);
    
    toast.success(`Added new batch of ${product.name}`);
  };
  
  const updateBatch = (updatedBatch: Batch) => {
    const oldBatch = batches.find(b => b.id === updatedBatch.id);
    if (!oldBatch) return;
    
    setBatches(prev => 
      prev.map(batch => 
        batch.id === updatedBatch.id ? updatedBatch : batch
      )
    );
    
    // Update inventory
    setInventory(prev => 
      prev.map(item => 
        item.batchId === updatedBatch.id 
          ? { 
              ...item, 
              quantity: updatedBatch.quantity,
              productName: updatedBatch.productName,
              category: updatedBatch.category,
              lastUpdated: new Date().toISOString()
            }
          : item
      )
    );
    
    // Add inventory mutation if quantity changed
    if (oldBatch.quantity !== updatedBatch.quantity) {
      const quantityDiff = updatedBatch.quantity - oldBatch.quantity;
      
      const newMutation = {
        id: uuidv4(),
        date: new Date().toISOString(),
        productId: updatedBatch.productId,
        productName: updatedBatch.productName,
        quantity: Math.abs(quantityDiff),
        type: quantityDiff > 0 ? "In" : "Out",
        user: "System"
      };
      
      setInventoryMutations(prev => [newMutation, ...prev]);
    }
    
    // Add activity
    addActivity("Edit", `Updated batch ${updatedBatch.batchCode} of ${updatedBatch.productName}`);
    
    toast.success(`Updated batch ${updatedBatch.batchCode}`);
  };
  
  const deleteBatch = (id: string) => {
    const batchToDelete = batches.find(b => b.id === id);
    if (!batchToDelete) return;
    
    // Check if batch is used in dispatches
    const usedInDispatches = dispatches.some(dispatch => dispatch.batchId === id);
    
    if (usedInDispatches) {
      toast.error(`Cannot delete batch ${batchToDelete.batchCode} as it is used in dispatches`);
      return;
    }
    
    setBatches(prev => prev.filter(batch => batch.id !== id));
    
    // Remove from inventory
    setInventory(prev => prev.filter(item => item.batchId !== id));
    
    // Add inventory mutation
    const newMutation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productId: batchToDelete.productId,
      productName: batchToDelete.productName,
      quantity: batchToDelete.quantity,
      type: "Out",
      user: "System"
    };
    
    setInventoryMutations(prev => [newMutation, ...prev]);
    
    // Add activity
    addActivity("Delete", `Removed batch ${batchToDelete.batchCode} of ${batchToDelete.productName}`);
    
    toast.success(`Deleted batch ${batchToDelete.batchCode}`);
  };

  return {
    addBatch,
    updateBatch,
    deleteBatch
  };
}
