
import Dashboard from "./Dashboard";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  // Using useData to verify the context is working properly
  const { products } = useData();
  
  return <Dashboard />;
};

export default Index;
