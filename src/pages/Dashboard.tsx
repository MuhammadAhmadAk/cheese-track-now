
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ArrowRight, 
  Camera, 
  BarChart4, 
  AlertCircle,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';

export default function Dashboard() {
  const { warningMessages, recentActivities, batches } = useData();
  
  // Get critical warnings only
  const criticalWarnings = warningMessages.filter(warning => warning.type === "Critical");
  
  // Get recent activities - most recent 5
  const latestActivities = recentActivities.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/input">
          <Button variant="outline" size="lg" className="dashboard-button w-full">
            <Plus className="w-8 h-8 text-weidebio" />
            <span className="text-lg">Input</span>
          </Button>
        </Link>
        
        <Link to="/dispatch">
          <Button variant="outline" size="lg" className="dashboard-button w-full">
            <ArrowRight className="w-8 h-8 text-weidebio" />
            <span className="text-lg">Dispatch</span>
          </Button>
        </Link>
        
        <Link to="/delivery-note">
          <Button variant="outline" size="lg" className="dashboard-button w-full">
            <Camera className="w-8 h-8 text-weidebio" />
            <span className="text-lg">Scan Delivery Note</span>
          </Button>
        </Link>
        
        <Link to="/reports">
          <Button variant="outline" size="lg" className="dashboard-button w-full">
            <BarChart4 className="w-8 h-8 text-weidebio" />
            <span className="text-lg">View Reports</span>
          </Button>
        </Link>
      </div>
      
      {/* Overview Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Critical Warnings */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Critical Warnings
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            {criticalWarnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-muted-foreground">No critical warnings</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {criticalWarnings.map(warning => (
                  <li key={warning.id} className="p-3 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-red-800">{warning.message}</p>
                    <p className="text-xs text-red-500 mt-1">
                      {format(new Date(warning.date), 'MMM d, yyyy HH:mm')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <ul className="divide-y">
              {latestActivities.map(activity => (
                <li key={activity.id} className="py-3 flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 w-2 h-2 rounded-full",
                    activity.type === "Input" ? "bg-green-500" : 
                    activity.type === "Dispatch" ? "bg-blue-500" :
                    activity.type === "Edit" ? "bg-amber-500" :
                    "bg-red-500"
                  )} />
                  
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-4 border-t">
              <Link 
                to="/reports" 
                className="text-sm text-weidebio hover:underline flex items-center"
              >
                View all activity <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Batch Overview */}
        <Card className="col-span-1 md:col-span-2 dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle>Batch Overview</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.slice(0, 5).map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batchCode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{batch.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{format(new Date(batch.date), 'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link 
                to="/inventory" 
                className="text-sm text-weidebio hover:underline flex items-center"
              >
                View all batches <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
