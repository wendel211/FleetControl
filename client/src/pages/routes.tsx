import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteCard } from "@/components/RouteCard";
import { Route } from "@shared/schema";
import { Plus, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Routes() {
  const { toast } = useToast();

  const { data: routes = [], isLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const handleTrackRoute = (route: Route) => {
    toast({
      title: "Rastreando Rota",
      description: `Agora rastreando ${route.name}`,
    });
  };

  const handleRouteDetails = (route: Route) => {
    toast({
      title: "Detalhes da Rota",
      description: `Visualizando detalhes de ${route.name}`,
    });
  };

  const activeRoutes = routes.filter(route => route.status === "in_progress");
  const plannedRoutes = routes.filter(route => route.status === "planned");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Planejamento de Rotas</h1>
          <Button className="fleet-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Criar Rota
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                  <div className="h-4 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Planejamento de Rotas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Otimize rotas e gerencie entregas</p>
        </div>
        <Button className="fleet-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Criar Rota
        </Button>
      </div>

      {/* Route Optimization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Route map visualization" 
                  className="w-full h-full object-cover rounded-lg opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background rounded-lg p-4 shadow-lg">
                    <MapPin className="h-8 w-8 text-primary mb-2 mx-auto" />
                    <p className="text-sm font-medium">Interactive Route Map</p>
                    <p className="text-xs text-muted-foreground">Real-time GPS tracking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Optimization Priority</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-input bg-background">
                    <option>Shortest Distance</option>
                    <option>Fastest Time</option>
                    <option>Fuel Efficiency</option>
                    <option>Balanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-input bg-background">
                    <option>All Vehicles</option>
                    <option>Trucks Only</option>
                    <option>Vans Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time Window</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="time" 
                      defaultValue="08:00" 
                      className="px-3 py-2 rounded-lg border border-input bg-background"
                    />
                    <input 
                      type="time" 
                      defaultValue="18:00" 
                      className="px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>
                
                <Button className="w-full fleet-button-secondary">
                  <MapPin className="h-4 w-4 mr-2" />
                  Optimize Route
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Routes */}
      {activeRoutes.length > 0 && (
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onTrack={handleTrackRoute}
                  onDetails={handleRouteDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planned Routes */}
      {plannedRoutes.length > 0 && (
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>Planned Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plannedRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onTrack={handleTrackRoute}
                  onDetails={handleRouteDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {routes.length === 0 && (
        <Card className="fleet-card">
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground">Get started by creating your first route</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
