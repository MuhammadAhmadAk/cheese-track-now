
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryNotePage() {
  // Mock functions - in a real app, these would connect to device camera or file upload
  const handleOpenCamera = () => {
    toast.info("Camera functionality would open here");
  };
  
  const handleUploadImage = () => {
    toast.info("Image upload functionality would open here");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Delivery Note Scanner</h1>
      
      <p className="text-gray-600">
        Use your device camera to scan delivery notes, or upload images of delivery notes.
        The system will extract product information, quantities, and dates automatically.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Scan Delivery Note
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Camera className="h-12 w-12 text-gray-400" />
            </div>
            
            <Button onClick={handleOpenCamera} className="w-full">
              Open Camera
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Position the delivery note within the frame and take a photo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            
            <Button onClick={handleUploadImage} className="w-full">
              Upload Image
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Upload an image of your delivery note for automatic processing
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        
        <CardContent>
          <ol className="list-decimal space-y-4 ml-6">
            <li>
              <strong>Scan or upload</strong> your delivery note
            </li>
            <li>
              <strong>Review</strong> the automatically extracted information
            </li>
            <li>
              <strong>Confirm</strong> to add items to inventory
            </li>
            <li>
              <strong>Track</strong> your delivery notes in the system
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
