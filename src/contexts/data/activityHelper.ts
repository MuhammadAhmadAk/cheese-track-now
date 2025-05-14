
import { RecentActivity } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

export function createActivityHelper(
  setRecentActivities: React.Dispatch<React.SetStateAction<RecentActivity[]>>
) {
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

  return {
    addActivity
  };
}
