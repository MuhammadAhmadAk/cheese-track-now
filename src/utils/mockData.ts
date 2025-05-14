
import { Batch, CheeseCategory, Dispatch, Inventory, InventoryMutation, Product, RecentActivity, WarningMessage } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

// Sample product data
export const products: Product[] = [
  { id: uuidv4(), name: "Gouda", category: "Cow" },
  { id: uuidv4(), name: "Cheddar", category: "Cow" },
  { id: uuidv4(), name: "Brie", category: "Cow" },
  { id: uuidv4(), name: "Chevre", category: "Goat" },
  { id: uuidv4(), name: "Feta", category: "Sheep" },
  { id: uuidv4(), name: "Blue Cheese", category: "Cow" },
  { id: uuidv4(), name: "Manchego", category: "Sheep" },
  { id: uuidv4(), name: "Roquefort", category: "Sheep" },
  { id: uuidv4(), name: "Camembert", category: "Cow" },
  { id: uuidv4(), name: "Ricotta", category: "Cow" },
];

// Generate batch code based on date
export const generateBatchCode = (date: Date = new Date()): string => {
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}${month}-${weekNumber}`;
};

// Generate batches
export const generateBatches = (): Batch[] => {
  const batches: Batch[] = [];
  const today = new Date();
  
  // Generate a few batches from the past month
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const batchDate = new Date(today);
    batchDate.setDate(today.getDate() - daysAgo);
    
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    batches.push({
      id: uuidv4(),
      batchCode: generateBatchCode(batchDate),
      productId: randomProduct.id,
      productName: randomProduct.name,
      category: randomProduct.category,
      quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
      date: batchDate.toISOString().split('T')[0],
      createdAt: batchDate.toISOString(),
    });
  }
  
  return batches;
};

// Sample batches
export const batches = generateBatches();

// Generate inventory based on batches
export const generateInventory = (): Inventory[] => {
  return batches.map(batch => ({
    productId: batch.productId,
    productName: batch.productName,
    category: batch.category,
    batchId: batch.id,
    batchCode: batch.batchCode,
    quantity: batch.quantity,
    lastUpdated: batch.createdAt,
  }));
};

// Sample inventory
export const inventory = generateInventory();

// Generate inventory mutations
export const generateInventoryMutations = (): InventoryMutation[] => {
  const mutations: InventoryMutation[] = [];
  
  // Generate input mutations for all batches
  batches.forEach(batch => {
    mutations.push({
      id: uuidv4(),
      date: batch.createdAt,
      productId: batch.productId,
      productName: batch.productName,
      quantity: batch.quantity,
      type: "In",
      user: "System",
    });
  });
  
  // Generate some random out mutations
  for (let i = 0; i < 5; i++) {
    const randomBatch = batches[Math.floor(Math.random() * batches.length)];
    const outDate = new Date(randomBatch.createdAt);
    outDate.setDate(outDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after batch creation
    
    mutations.push({
      id: uuidv4(),
      date: outDate.toISOString(),
      productId: randomBatch.productId,
      productName: randomBatch.productName,
      quantity: Math.floor(randomBatch.quantity / 2), // Use half the batch quantity
      type: "Out",
      user: "System",
    });
  }
  
  // Sort by date, most recent first
  return mutations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Sample inventory mutations
export const inventoryMutations = generateInventoryMutations();

// Generate dispatches
export const generateDispatches = (): Dispatch[] => {
  const dispatches: Dispatch[] = [];
  const customers = ["ABC Market", "XYZ Wholesale", "Local Shop", "City Grocery", "Farmers Market"];
  
  // Create dispatches for some of the batches
  for (let i = 0; i < 5; i++) {
    const randomBatch = batches[Math.floor(Math.random() * batches.length)];
    const dispatchDate = new Date(randomBatch.createdAt);
    dispatchDate.setDate(dispatchDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after batch creation
    
    const isWholesale = Math.random() > 0.5;
    
    dispatches.push({
      id: uuidv4(),
      date: dispatchDate.toISOString().split('T')[0],
      productId: randomBatch.productId,
      productName: randomBatch.productName,
      batchId: randomBatch.id,
      batchCode: randomBatch.batchCode,
      quantity: Math.floor(randomBatch.quantity / 2), // Use half the batch quantity
      type: isWholesale ? "Wholesale" : "Market",
      customer: isWholesale ? customers[Math.floor(Math.random() * customers.length)] : undefined,
    });
  }
  
  // Sort by date, most recent first
  return dispatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Sample dispatches
export const dispatches = generateDispatches();

// Generate warning messages
export const generateWarningMessages = (): WarningMessage[] => {
  const warnings: WarningMessage[] = [];
  
  // Find products with low inventory
  const productCounts: Record<string, number> = {};
  
  inventory.forEach(item => {
    if (!productCounts[item.productId]) {
      productCounts[item.productId] = 0;
    }
    productCounts[item.productId] += item.quantity;
  });
  
  // Generate warnings for products with low inventory
  Object.entries(productCounts).forEach(([productId, count]) => {
    if (count < 20) {
      const product = products.find(p => p.id === productId);
      if (product) {
        warnings.push({
          id: uuidv4(),
          type: "Critical",
          message: `Low inventory for ${product.name}: ${count} units left`,
          date: new Date().toISOString(),
        });
      }
    }
  });
  
  // Add a few more random warnings
  warnings.push({
    id: uuidv4(),
    type: "Warning",
    message: "Batch 2305-2 is approaching expiry date",
    date: new Date().toISOString(),
  });
  
  warnings.push({
    id: uuidv4(),
    type: "Info",
    message: "New product added to assortment: Parmesan",
    date: new Date().toISOString(),
  });
  
  return warnings;
};

// Sample warning messages
export const warningMessages = generateWarningMessages();

// Generate recent activities
export const generateRecentActivities = (): RecentActivity[] => {
  const activities: RecentActivity[] = [];
  
  // Activities for batch inputs
  batches.slice(0, 5).forEach(batch => {
    activities.push({
      id: uuidv4(),
      type: "Input",
      description: `Added ${batch.quantity} units of ${batch.productName} (Batch: ${batch.batchCode})`,
      date: batch.createdAt,
      user: "System",
    });
  });
  
  // Activities for dispatches
  dispatches.slice(0, 3).forEach(dispatch => {
    activities.push({
      id: uuidv4(),
      type: "Dispatch",
      description: `Dispatched ${dispatch.quantity} units of ${dispatch.productName} to ${dispatch.type === "Wholesale" ? dispatch.customer : "Market"}`,
      date: new Date(dispatch.date).toISOString(),
      user: "System",
    });
  });
  
  // Add a few edit activities
  activities.push({
    id: uuidv4(),
    type: "Edit",
    description: "Updated inventory for Gouda Batch 2305-1",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: "System",
  });
  
  activities.push({
    id: uuidv4(),
    type: "Delete",
    description: "Removed incorrect batch entry: Cheddar Batch 2304-3",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: "System",
  });
  
  // Sort by date, most recent first
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Sample recent activities
export const recentActivities = generateRecentActivities();
