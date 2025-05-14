
import { createContext, useContext, ReactNode, useState } from 'react';
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

import { DataContextType } from './data/types';
import { createProductOperations } from './data/productOperations';
import { createBatchOperations } from './data/batchOperations';
import { createDispatchOperations } from './data/dispatchOperations';
import { createActivityHelper } from './data/activityHelper';

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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [inventory, setInventory] = useState<Inventory[]>(initialInventory);
  const [inventoryMutations, setInventoryMutations] = useState<InventoryMutation[]>(initialInventoryMutations);
  const [dispatches, setDispatches] = useState<Dispatch[]>(initialDispatches);
  const [warningMessages, setWarningMessages] = useState<WarningMessage[]>(initialWarningMessages);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(initialRecentActivities);

  // Create activity helper
  const { addActivity } = createActivityHelper(setRecentActivities);

  // Create product operations
  const { addProduct, updateProduct, deleteProduct } = createProductOperations(
    products,
    setProducts,
    batches,
    setBatches,
    setInventory,
    setInventoryMutations,
    setDispatches,
    addActivity
  );

  // Create batch operations
  const { addBatch, updateBatch, deleteBatch } = createBatchOperations(
    products,
    batches,
    dispatches,
    setBatches,
    setInventory,
    setInventoryMutations,
    generateBatchCode,
    addActivity
  );

  // Create dispatch operations - Pass dispatches as argument
  const { addDispatch, updateDispatch, deleteDispatch } = createDispatchOperations(
    products,
    batches,
    inventory,
    dispatches,
    setDispatches,
    setInventory,
    setInventoryMutations,
    addActivity
  );

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
