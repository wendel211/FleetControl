import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/VehicleCard";
import { Vehicle } from "@shared/schema";
import { Plus, Filter, Search, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewVehicle = (vehicle: Vehicle) => {
    toast({
      title: "Detalhes do Veículo",
      description: `Visualizando detalhes de ${vehicle.vehicleId}`,
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    toast({
      title: "Editar Veículo",
      description: `Editando ${vehicle.vehicleId}`,
    });
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    toast({
      title: "Excluir Veículo",
      description: `Isso excluirá ${vehicle.vehicleId}`,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestão de Veículos</h1>
          <Button className="fleet-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Veículo
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestão de Veículos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gerencie todos os veículos da sua frota</p>
        </div>
        <Button className="fleet-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Veículo
        </Button>
      </div>
      
      {/* Filter and Search */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar veículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="maintenance">Manutenção</option>
              <option value="inactive">Inativo</option>
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              <option value="all">Todos os Tipos</option>
              <option value="truck">Caminhão</option>
              <option value="van">Van</option>
              <option value="car">Carro</option>
            </select>
            <Button className="fleet-button-primary">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onView={handleViewVehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Nenhum veículo encontrado</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                ? "Tente ajustar sua pesquisa ou filtros" 
                : "Comece adicionando seu primeiro veículo"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
