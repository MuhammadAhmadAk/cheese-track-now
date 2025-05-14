
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

export interface DataContextType {
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
