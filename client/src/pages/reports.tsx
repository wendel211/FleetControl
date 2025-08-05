import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/Chart";
import { DashboardStats } from "@/types";
import { mockFuelEfficiencyData, mockUtilizationData } from "@/lib/mockData";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Construction,
  Fuel,
  Gauge,
  DollarSign
} from "lucide-react";

export default function Reports() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleExport = () => {
    // Implementation for exporting reports
    console.log("Exporting reports...");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Relatórios e Análises</h1>
          <Button variant="outline" className="animate-pulse">
            <Download className="h-4 w-4 mr-2" />
            Carregando...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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

  const reportCards = [
    {
      title: "Distância Total",
      value: `${(stats?.totalDistance || 45280).toLocaleString()} km`,
      change: "+8% do mês passado",
      trend: "up",
      icon: Construction,
      color: "text-blue-500",
    },
    {
      title: "Combustível Consumido",
      value: "3.720 L",
      change: "+12% do mês passado",
      trend: "down",
      icon: Fuel,
      color: "text-red-500",
    },
    {
      title: "Velocidade Média",
      value: "68 km/h",
      change: "+2% eficiência",
      trend: "up",
      icon: Gauge,
      color: "text-green-500",
    },
    {
      title: "Maintenance Costs",
      value: "$12,450",
      change: "+15% from last month",
      trend: "down",
      icon: DollarSign,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fleet Reports & Analytics</h1>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 rounded-lg border border-input bg-background">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
          <Button onClick={handleExport} className="fleet-button-primary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report) => (
          <Card key={report.title} className="fleet-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{report.title}</p>
                  <p className="text-2xl font-bold">{report.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    report.trend === "up" ? "text-secondary" : "text-red-500"
                  }`}>
                    {report.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {report.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-muted rounded-xl flex items-center justify-center ${report.color}`}>
                  <report.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>Fuel Efficiency Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart data={mockFuelEfficiencyData} type="bar" height={256} />
          </CardContent>
        </Card>

        <Card className="fleet-card">
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart data={mockUtilizationData} type="pie" height={256} />
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Active ({stats?.activeVehicles || 78})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>Available (32)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Maintenance ({stats?.maintenanceDue || 12})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded"></div>
                <span>Inactive (5)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="fleet-card">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98.5%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery Rate</div>
              <div className="text-xs text-secondary mt-1">+2.3% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">4.2</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
              <div className="text-xs text-secondary mt-1">+0.3 vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">2.1</div>
              <div className="text-sm text-muted-foreground">Incidents per 1000km</div>
              <div className="text-xs text-red-500 mt-1">-0.4 vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card className="fleet-card">
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Fuel Costs</div>
                <div className="text-sm text-muted-foreground">Monthly average</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$8,420</div>
                <div className="text-sm text-red-500">+12% vs last month</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Maintenance Costs</div>
                <div className="text-sm text-muted-foreground">Monthly average</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$3,280</div>
                <div className="text-sm text-secondary">-5% vs last month</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Insurance & Registration</div>
                <div className="text-sm text-muted-foreground">Monthly average</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$1,850</div>
                <div className="text-sm text-muted-foreground">No change</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
