import { Vehicle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Car, Users, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onView, onEdit, onDelete }: VehicleCardProps) {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case "truck":
        return <Truck className="h-5 w-5" />;
      case "van":
        return <Users className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getStatusBadge = () => {
    switch (vehicle.status) {
      case "active":
        return <Badge className="fleet-status-active">Active</Badge>;
      case "maintenance":
        return <Badge className="fleet-status-maintenance">Maintenance</Badge>;
      case "inactive":
        return <Badge className="fleet-status-inactive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{vehicle.status}</Badge>;
    }
  };

  const getFuelColor = () => {
    const level = parseFloat(vehicle.fuelLevel || "0");
    if (level < 25) return "bg-red-500";
    if (level < 50) return "bg-amber-500";
    return "bg-secondary";
  };

  return (
    <Card className="fleet-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-primary">{getVehicleIcon()}</div>
            <div>
              <h3 className="font-semibold">{vehicle.vehicleId}</h3>
              <p className="text-sm text-muted-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Driver:</span>
            <span>{vehicle.driverName || "Unassigned"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span>{vehicle.currentLocation || "Unknown"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mileage:</span>
            <span>{vehicle.mileage?.toLocaleString()} km</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Fuel Level:</span>
            <span>{vehicle.fuelLevel}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full">
            <div 
              className={cn("h-full rounded-full transition-all", getFuelColor())}
              style={{ width: `${vehicle.fuelLevel}%` }}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(vehicle)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(vehicle)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(vehicle)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
