import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/Chart";
import { DashboardStats } from "@/types";
import { mockActivities, mockPerformanceData } from "@/lib/mockData";
import { 
  Truck, 
  Route, 
  Fuel, 
  Wrench, 
  TrendingUp, 
  TrendingDown,
  Check,
  Plus,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Painel Inicial</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Veículos",
      value: stats?.totalVehicles || 0,
      change: "+12% do mês passado",
      trend: "up",
      icon: Truck,
      color: "text-blue-500",
    },
    {
      title: "Rotas Ativas",
      value: stats?.activeRoutes || 0,
      change: "+5% eficiência",
      trend: "up",
      icon: Route,
      color: "text-green-500",
    },
    {
      title: "Eficiência Combustível",
      value: `${stats?.averageFuel?.toFixed(1) || 0} L/100km`,
      change: "-3% consumo",
      trend: "up",
      icon: Fuel,
      color: "text-purple-500",
    },
    {
      title: "Manutenções Pendentes",
      value: stats?.maintenanceDue || 0,
      change: `${stats?.maintenanceOverdue || 0} atrasadas`,
      trend: "down",
      icon: Wrench,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Painel Inicial</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Visão geral da sua frota</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 dark:text-slate-400">Última atualização</p>
          <p className="text-sm font-medium text-slate-800 dark:text-white">{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-500"
                  }`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Performance Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-800 dark:text-white">Desempenho da Frota</CardTitle>
            <select className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 3 meses</option>
            </select>
          </CardHeader>
          <CardContent>
            <Chart data={mockPerformanceData} type="bar" height={256} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-muted rounded-full flex items-center justify-center ${activity.iconColor}`}>
                    {activity.icon === "check" && <Check className="h-4 w-4" />}
                    {activity.icon === "wrench" && <Wrench className="h-4 w-4" />}
                    {activity.icon === "plus" && <Plus className="h-4 w-4" />}
                    {activity.icon === "exclamation" && <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description} • {format(activity.timestamp, "MMM dd")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
