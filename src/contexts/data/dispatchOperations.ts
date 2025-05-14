
import { Dispatch, Product, Batch, Inventory } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export function createDispatchOperations(
  products: Product[],
  batches: Batch[],
  inventory: Inventory[],
  dispatches: Dispatch[],
  setDispatches: React.Dispatch<React.SetStateAction<Dispatch[]>>,
  setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>,
  setInventoryMutations: React.Dispatch<React.SetStateAction<any[]>>,
  addActivity: (type: "Input" | "Dispatch" | "Edit" | "Delete", description: string) => void
) {
  const addDispatch = (productId: string, batchId: string, quantity: number, type: "Market" | "Wholesale", customer?: string) => {
    const product = products.find(p => p.id === productId);
    const batch = batches.find(b => b.id === batchId);
    
    if (!product || !batch) return;
    
    // Check if enough inventory
    const inventoryItem = inventory.find(i => i.batchId === batchId);
    
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      toast.error(`Not enough inventory for ${product.name} in batch ${batch.batchCode}`);
      return;
    }
    
    const newDispatch: Dispatch = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      productId,
      productName: product.name,
      batchId,
      batchCode: batch.batchCode,
      quantity,
      type,
      customer: type === "Wholesale" ? customer : undefined
    };
    
    setDispatches(prev => [newDispatch, ...prev]);
    
    // Update inventory
    setInventory(prev => 
      prev.map(item => 
        item.batchId === batchId 
          ? { 
              ...item, 
              quantity: item.quantity - quantity,
              lastUpdated: new Date().toISOString()
            }
          : item
      )
    );
    
    // Add inventory mutation
    const newMutation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productId,
      productName: product.name,
      quantity,
      type: "Out",
      user: "System"
    };
    
    setInventoryMutations(prev => [newMutation, ...prev]);
    
    // Add activity
    const destination = type === "Wholesale" ? customer : "Market";
    addActivity("Dispatch", `Dispatched ${quantity} units of ${product.name} to ${destination}`);
    
    toast.success(`Added new dispatch of ${product.name}`);
  };
  
  const updateDispatch = (updatedDispatch: Dispatch) => {
    const oldDispatch = dispatches.find(d => d.id === updatedDispatch.id);
    if (!oldDispatch) return;
    
    // Update inventory if quantity changed
    if (oldDispatch.quantity !== updatedDispatch.quantity) {
      const quantityDiff = updatedDispatch.quantity - oldDispatch.quantity;
      
      // Check if enough inventory for an increase
      if (quantityDiff > 0) {
        const inventoryItem = inventory.find(i => i.batchId === updatedDispatch.batchId);
        
        if (!inventoryItem || inventoryItem.quantity < quantityDiff) {
          toast.error(`Not enough inventory for ${updatedDispatch.productName} in batch ${updatedDispatch.batchCode}`);
          return;
        }
      }
      
      // Update inventory
      setInventory(prev => 
        prev.map(item => 
          item.batchId === updatedDispatch.batchId 
            ? { 
                ...item, 
                quantity: item.quantity - quantityDiff,
                lastUpdated: new Date().toISOString()
              }
            : item
        )
      );
      
      // Add inventory mutation
      const newMutation = {
        id: uuidv4(),
        date: new Date().toISOString(),
        productId: updatedDispatch.productId,
        productName: updatedDispatch.productName,
        quantity: Math.abs(quantityDiff),
        type: quantityDiff > 0 ? "Out" : "In",
        user: "System"
      };
      
      setInventoryMutations(prev => [newMutation, ...prev]);
    }
    
    setDispatches(prev => 
      prev.map(dispatch => 
        dispatch.id === updatedDispatch.id ? updatedDispatch : dispatch
      )
    );
    
    // Add activity
    const destination = updatedDispatch.type === "Wholesale" ? updatedDispatch.customer : "Market";
    addActivity("Edit", `Updated dispatch of ${updatedDispatch.productName} to ${destination}`);
    
    toast.success(`Updated dispatch of ${updatedDispatch.productName}`);
  };
  
  const deleteDispatch = (id: string) => {
    const dispatchToDelete = dispatches.find(d => d.id === id);
    if (!dispatchToDelete) return;
    
    setDispatches(prev => prev.filter(dispatch => dispatch.id !== id));
    
    // Update inventory - add back the quantity
    setInventory(prev => 
      prev.map(item => 
        item.batchId === dispatchToDelete.batchId 
          ? { 
              ...item, 
              quantity: item.quantity + dispatchToDelete.quantity,
              lastUpdated: new Date().toISOString()
            }
          : item
      )
    );
    
    // Add inventory mutation
    const newMutation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productId: dispatchToDelete.productId,
      productName: dispatchToDelete.productName,
      quantity: dispatchToDelete.quantity,
      type: "In",
      user: "System"
    };
    
    setInventoryMutations(prev => [newMutation, ...prev]);
    
    // Add activity
    const destination = dispatchToDelete.type === "Wholesale" ? dispatchToDelete.customer : "Market";
    addActivity("Delete", `Removed dispatch of ${dispatchToDelete.productName} to ${destination}`);
    
    toast.success(`Deleted dispatch of ${dispatchToDelete.productName}`);
  };

  return {
    addDispatch,
    updateDispatch,
    deleteDispatch
  };
}
