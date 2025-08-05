import { Route } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Truck, User } from "lucide-react";

interface RouteCardProps {
  route: Route;
  onTrack: (route: Route) => void;
  onDetails: (route: Route) => void;
}

export function RouteCard({ route, onTrack, onDetails }: RouteCardProps) {
  const getStatusBadge = () => {
    switch (route.status) {
      case "in_progress":
        return <Badge className="fleet-status-active">In Progress</Badge>;
      case "planned":
        return <Badge className="fleet-status-maintenance">Planned</Badge>;
      case "completed":
        return <Badge className="fleet-status-inactive">Completed</Badge>;
      default:
        return <Badge variant="outline">{route.status}</Badge>;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="fleet-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{route.name}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-primary" />
            <span>Route: {route.routeId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-primary" />
            <span>Driver: {route.driverName || "Unassigned"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{route.stops?.length || 0} stops</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {route.estimatedDuration 
                ? formatDuration(route.estimatedDuration) 
                : "TBD"
              }
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1">Route Details:</div>
          <div className="text-sm">
            <div>{route.startLocation}</div>
            <div className="text-xs text-muted-foreground">↓</div>
            <div>{route.endLocation}</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onTrack(route)}
            className="flex-1"
          >
            Track
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDetails(route)}
            className="flex-1"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
