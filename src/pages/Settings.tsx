import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function SettingsPage() {
  // Stock settings
  const [minStockLevel, setMinStockLevel] = useState(10);
  
  // Backup settings
  const [backupFrequency, setBackupFrequency] = useState("daily");
  
  // Export settings
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportEmail, setExportEmail] = useState("");
  const [autoExport, setAutoExport] = useState(false);
  const [exportFrequency, setExportFrequency] = useState("monthly");
  
  // Other settings
  const [voiceInput, setVoiceInput] = useState(false);
  
  // Save settings
  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };
  
  // Test voice input
  const testVoiceInput = () => {
    toast.info("Voice input test would start here");
  };
  
  // Delete test data confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const handleDeleteTestData = () => {
    if (deleteConfirm) {
      toast.success("Test data deleted successfully");
      setDeleteConfirm(false);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => {
        setDeleteConfirm(false);
      }, 5000); // Reset after 5 seconds
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        {/* Stock Settings */}
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="min-stock">Minimum Stock Level (General)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="min-stock"
                    type="number"
                    min="0"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    Products below this level will trigger warnings
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Product-specific minimum stock levels can be set on a future enhanced version.
              </p>
              
              <Button onClick={saveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Backup Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={saveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Export Settings */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>SKAL Export Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="export-email">Email Reports To</Label>
                <Input
                  id="export-email"
                  type="email"
                  placeholder="email@example.com"
                  value={exportEmail}
                  onChange={(e) => setExportEmail(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-export"
                  checked={autoExport}
                  onCheckedChange={setAutoExport}
                />
                <Label htmlFor="auto-export">Enable Automatic Exports</Label>
              </div>
              
              {autoExport && (
                <div className="space-y-2">
                  <Label htmlFor="export-frequency">Export Frequency</Label>
                  <Select value={exportFrequency} onValueChange={setExportFrequency}>
                    <SelectTrigger id="export-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button onClick={saveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-input"
                  checked={voiceInput}
                  onCheckedChange={setVoiceInput}
                />
                <Label htmlFor="voice-input">Enable Voice Input</Label>
              </div>
              
              {voiceInput && (
                <Button variant="outline" onClick={testVoiceInput}>
                  Test Voice Input
                </Button>
              )}
              
              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteTestData}
                >
                  {deleteConfirm ? "Click again to confirm" : "Delete Test Data"}
                </Button>
                
                <p className="text-sm text-muted-foreground mt-2">
                  This will permanently delete all test data in the system.
                </p>
              </div>
              
              <Button onClick={saveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
