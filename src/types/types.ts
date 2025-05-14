
export type CheeseCategory = "Cow" | "Goat" | "Sheep" | "Mixed" | "Plant-based";

export interface Product {
  id: string;
  name: string;
  category: CheeseCategory;
}

export interface Batch {
  id: string;
  batchCode: string;
  productId: string;
  productName: string;
  category: CheeseCategory;
  quantity: number;
  date: string;
  createdAt: string;
}

export interface Inventory {
  productId: string;
  productName: string;
  category: CheeseCategory;
  batchId: string;
  batchCode: string;
  quantity: number;
  lastUpdated: string;
}

export interface InventoryMutation {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  type: "In" | "Out";
  user: string;
}

export interface Dispatch {
  id: string;
  date: string;
  productId: string;
  productName: string;
  batchId: string;
  batchCode: string;
  quantity: number;
  type: "Market" | "Wholesale";
  customer?: string;
}

export interface WarningMessage {
  id: string;
  type: "Critical" | "Warning" | "Info";
  message: string;
  date: string;
}

export interface RecentActivity {
  id: string;
  type: "Input" | "Dispatch" | "Edit" | "Delete";
  description: string;
  date: string;
  user: string;
}
