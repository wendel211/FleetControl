import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@shared/schema";
import { RefreshCw, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Tracking() {
  const { toast } = useToast();

  const { data: vehicles = [], isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const activeVehicles = vehicles.filter(v => v.status === "active");
  const idleVehicles = vehicles.filter(v => v.status === "maintenance");
  const alertVehicles = vehicles.filter(v => parseFloat(v.fuelLevel || "100") < 25);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Dados Atualizados",
      description: "Localizações dos veículos foram atualizadas",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Rastreamento em Tempo Real</h1>
          <Button variant="outline" className="animate-pulse">
            <RefreshCw className="h-4 w-4 mr-2" />
            Carregando...
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-96 bg-muted rounded-lg"></div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Rastreamento em Tempo Real</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Monitore todos os seus veículos em tempo real</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Atualizações ao Vivo</span>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Display */}
        <div className="lg:col-span-3">
          <Card className="fleet-card">
            <CardContent className="p-6">
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-lg relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Live tracking map view" 
                  className="w-full h-full object-cover rounded-lg opacity-60"
                />
                
                {/* Mock GPS Markers */}
                <div className="absolute top-20 left-32 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-40 right-24 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute bottom-32 left-20 w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                
                <div className="absolute top-4 right-4 bg-background rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span>Active ({activeVehicles.length})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Idle ({idleVehicles.length})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Alert ({alertVehicles.length})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Status Panel */}
        <div>
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.slice(0, 5).map((vehicle) => {
                  const fuelLevel = parseFloat(vehicle.fuelLevel || "100");
                  const isLowFuel = fuelLevel < 25;
                  const statusColor = vehicle.status === "active" ? "bg-secondary" : 
                                    vehicle.status === "maintenance" ? "bg-amber-500" : "bg-red-500";
                  
                  return (
                    <div key={vehicle.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{vehicle.vehicleId}</span>
                        <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Speed: {vehicle.status === "active" ? "65 km/h" : "0 km/h"}</div>
                        <div>Location: {vehicle.currentLocation}</div>
                        <div>Driver: {vehicle.driverName}</div>
                        <div className="flex items-center justify-between">
                          <span>Fuel: {vehicle.fuelLevel}%</span>
                          {isLowFuel && (
                            <Badge variant="destructive" className="text-xs">
                              Low Fuel
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Updates Section */}
      <Card className="fleet-card">
        <CardHeader>
          <CardTitle>Live Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">FL-127 updated location</p>
                <p className="text-xs text-muted-foreground">Downtown Seattle • Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">FL-045 fuel level critical</p>
                <p className="text-xs text-muted-foreground">Highway 99 • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">FL-089 arrived at service center</p>
                <p className="text-xs text-muted-foreground">Service Center • 5 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {vehicles.length === 0 && (
        <Card className="fleet-card">
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles to track</h3>
            <p className="text-muted-foreground">Add vehicles to start live tracking</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
