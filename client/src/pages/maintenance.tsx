import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceCard } from "@/components/MaintenanceCard";
import { Maintenance } from "@shared/schema";
import { Plus, Calendar, AlertTriangle, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MaintenancePage() {
  const { toast } = useToast();

  const { data: maintenance = [], isLoading } = useQuery<Maintenance[]>({
    queryKey: ["/api/maintenance"],
  });

  const handleScheduleMaintenance = (maintenanceItem: Maintenance) => {
    toast({
      title: "Agendar Manutenção",
      description: `Agendando ${maintenanceItem.serviceType}`,
    });
  };

  const handleRescheduleMaintenance = (maintenanceItem: Maintenance) => {
    toast({
      title: "Reagendar Manutenção",
      description: `Reagendando ${maintenanceItem.serviceType}`,
    });
  };

  const todayMaintenance = maintenance.filter(m => {
    const today = new Date();
    const scheduledDate = new Date(m.scheduledDate);
    return scheduledDate.toDateString() === today.toDateString();
  });

  const overdueMaintenance = maintenance.filter(m => m.status === "overdue");
  const scheduledMaintenance = maintenance.filter(m => m.status === "scheduled");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestão de Manutenção</h1>
          <Button className="fleet-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Agendar Manutenção
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestão de Manutenção</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gerencie e agende manutenções preventivas</p>
        </div>
        <Button className="fleet-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Agendar Manutenção
        </Button>
      </div>

      {/* Maintenance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="fleet-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Scheduled Today</p>
                <p className="text-3xl font-bold text-amber-500">{todayMaintenance.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="fleet-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue</p>
                <p className="text-3xl font-bold text-red-500">{overdueMaintenance.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="fleet-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">This Month</p>
                <p className="text-3xl font-bold">{maintenance.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Wrench className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Maintenance */}
      {overdueMaintenance.length > 0 && (
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Overdue Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueMaintenance.map((item) => (
                <MaintenanceCard
                  key={item.id}
                  maintenance={item}
                  onSchedule={handleScheduleMaintenance}
                  onReschedule={handleRescheduleMaintenance}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Maintenance */}
      {scheduledMaintenance.length > 0 && (
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledMaintenance.map((item) => (
                <MaintenanceCard
                  key={item.id}
                  maintenance={item}
                  onSchedule={handleScheduleMaintenance}
                  onReschedule={handleRescheduleMaintenance}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {maintenance.length === 0 && (
        <Card className="fleet-card">
          <CardContent className="text-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No maintenance records found</h3>
            <p className="text-muted-foreground">Get started by scheduling your first maintenance</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
