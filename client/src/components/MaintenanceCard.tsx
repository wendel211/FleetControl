import { Maintenance } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface MaintenanceCardProps {
  maintenance: Maintenance;
  vehicleId?: string;
  onSchedule: (maintenance: Maintenance) => void;
  onReschedule: (maintenance: Maintenance) => void;
}

export function MaintenanceCard({ 
  maintenance, 
  vehicleId, 
  onSchedule, 
  onReschedule 
}: MaintenanceCardProps) {
  const getStatusBadge = () => {
    switch (maintenance.status) {
      case "scheduled":
        return <Badge className="fleet-status-maintenance">Scheduled</Badge>;
      case "overdue":
        return <Badge className="fleet-priority-high">Overdue</Badge>;
      case "completed":
        return <Badge className="fleet-status-active">Completed</Badge>;
      case "in_progress":
        return <Badge className="fleet-priority-medium">In Progress</Badge>;
      default:
        return <Badge variant="outline">{maintenance.status}</Badge>;
    }
  };

  const getPriorityBadge = () => {
    switch (maintenance.priority) {
      case "high":
        return <Badge className="fleet-priority-high">High</Badge>;
      case "medium":
        return <Badge className="fleet-priority-medium">Medium</Badge>;
      case "low":
        return <Badge className="fleet-priority-low">Low</Badge>;
      default:
        return <Badge variant="outline">{maintenance.priority}</Badge>;
    }
  };

  return (
    <Card className="fleet-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{maintenance.serviceType}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span>Vehicle: {vehicleId || maintenance.vehicleId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Due: {format(new Date(maintenance.scheduledDate), "MMM dd, yyyy")}</span>
          </div>
          {maintenance.cost && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>Cost: ${maintenance.cost}</span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Priority:</span>
            {getPriorityBadge()}
          </div>
          {maintenance.description && (
            <p className="text-sm text-muted-foreground">{maintenance.description}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {maintenance.status === "scheduled" ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReschedule(maintenance)}
              className="flex-1"
            >
              Reschedule
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSchedule(maintenance)}
              className="flex-1"
            >
              Schedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
