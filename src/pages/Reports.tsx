
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Calendar, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateType, setDateType] = useState<"start" | "end">("start");
  
  const handleExport = (reportType: string) => {
    toast.success(`${reportType} report would be exported here (${format(startDate, 'MM/dd/yyyy')} - ${format(endDate, 'MM/dd/yyyy')})`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reports</h1>
      
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date Range</CardTitle>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  onClick={() => setDateType("start")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateType === "start" ? startDate : endDate}
                  onSelect={(date) => date && (dateType === "start" ? setStartDate(date) : setEndDate(date))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  onClick={() => setDateType("end")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateType === "start" ? startDate : endDate}
                  onSelect={(date) => date && (dateType === "start" ? setStartDate(date) : setEndDate(date))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SKAL Export */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileDown className="mr-2 h-5 w-5" />
              SKAL Export
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-gray-600 mb-6">
              Generate SKAL-compliant export of dispatches and batches for the selected period.
            </p>
            
            <Button 
              className="w-full mt-auto" 
              onClick={() => handleExport('SKAL')}
            >
              Export SKAL Report
            </Button>
          </CardContent>
        </Card>
        
        {/* Inventory Report */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileDown className="mr-2 h-5 w-5" />
              Inventory Report
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-gray-600 mb-6">
              Generate a complete inventory report with all current stock levels.
            </p>
            
            <Button 
              className="w-full mt-auto" 
              onClick={() => handleExport('Inventory')}
            >
              Export Inventory Report
            </Button>
          </CardContent>
        </Card>
        
        {/* Dispatch Report */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileDown className="mr-2 h-5 w-5" />
              Dispatch Report
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-gray-600 mb-6">
              Generate a report of all dispatches in the selected period.
            </p>
            
            <Button 
              className="w-full mt-auto" 
              onClick={() => handleExport('Dispatch')}
            >
              Export Dispatch Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
