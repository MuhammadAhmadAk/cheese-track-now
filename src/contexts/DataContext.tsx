
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  Batch, 
  CheeseCategory, 
  Dispatch, 
  Inventory, 
  InventoryMutation, 
  Product, 
  RecentActivity, 
  WarningMessage 
} from '@/types/types';
import { 
  batches as initialBatches, 
  dispatches as initialDispatches, 
  inventory as initialInventory,
  inventoryMutations as initialInventoryMutations, 
  products as initialProducts,
  recentActivities as initialRecentActivities,
  warningMessages as initialWarningMessages,
  generateBatchCode
} from '@/utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface DataContextType {
  products: Product[];
  batches: Batch[];
  inventory: Inventory[];
  inventoryMutations: InventoryMutation[];
  dispatches: Dispatch[];
  warningMessages: WarningMessage[];
  recentActivities: RecentActivity[];
  
  // Product methods
  addProduct: (name: string, category: CheeseCategory) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Batch methods
  addBatch: (productId: string, quantity: number, date?: string) => void;
  updateBatch: (batch: Batch) => void;
  deleteBatch: (id: string) => void;
  
  // Dispatch methods
  addDispatch: (productId: string, batchId: string, quantity: number, type: "Market" | "Wholesale", customer?: string) => void;
  updateDispatch: (dispatch: Dispatch) => void;
  deleteDispatch: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [inventory, setInventory] = useState<Inventory[]>(initialInventory);
  const [inventoryMutations, setInventoryMutations] = useState<InventoryMutation[]>(initialInventoryMutations);
  const [dispatches, setDispatches] = useState<Dispatch[]>(initialDispatches);
  const [warningMessages, setWarningMessages] = useState<WarningMessage[]>(initialWarningMessages);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(initialRecentActivities);

  // Product methods
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

  // Batch methods
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
    const newInventory: Inventory = {
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
    const newMutation: InventoryMutation = {
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
      
      const newMutation: InventoryMutation = {
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
    const newMutation: InventoryMutation = {
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

  // Dispatch methods
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
    const newMutation: InventoryMutation = {
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
      const newMutation: InventoryMutation = {
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
    const newMutation: InventoryMutation = {
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
  
  // Helper function to add activity
  const addActivity = (type: "Input" | "Dispatch" | "Edit" | "Delete", description: string) => {
    const newActivity: RecentActivity = {
      id: uuidv4(),
      type,
      description,
      date: new Date().toISOString(),
      user: "System"
    };
    
    setRecentActivities(prev => [newActivity, ...prev]);
  };

  const value = {
    products,
    batches,
    inventory,
    inventoryMutations,
    dispatches,
    warningMessages,
    recentActivities,
    addProduct,
    updateProduct,
    deleteProduct,
    addBatch,
    updateBatch,
    deleteBatch,
    addDispatch,
    updateDispatch,
    deleteDispatch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
