import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  BarChart3, 
  Brain, 
  Camera,
  Smartphone,
  Shield,
  TrendingUp,
  Gauge,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface AdvancedReports {
  fuelEfficiency: {
    average: number;
    trend: string;
    data: number[];
  };
  costAnalysis: {
    totalCost: number;
    breakdown: {
      fuel: number;
      maintenance: number;
      insurance: number;
    };
  };
  performance: {
    totalKm: number;
    avgSpeed: number;
    incidents: number;
  };
}

interface GPSTracking {
  id: string;
  vehicleId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number;
  heading: number;
  lastUpdate: string;
}

export default function PremiumFeatures() {
  const [activeTab, setActiveTab] = useState<'gps' | 'reports' | 'ai'>('gps');

  const { data: gpsData, isLoading: gpsLoading } = useQuery<GPSTracking[]>({
    queryKey: ["/api/gps-tracking"],
    refetchInterval: 10000, // Update every 10 seconds
  });

  const { data: reportsData, isLoading: reportsLoading } = useQuery<AdvancedReports>({
    queryKey: ["/api/advanced-reports"],
  });

  const features = [
    {
      id: 'gps',
      name: 'Rastreamento GPS',
      icon: MapPin,
      color: 'text-red-500',
      premium: true,
      description: 'Localização em tempo real de todos os veículos'
    },
    {
      id: 'reports',
      name: 'Relatórios Avançados',
      icon: BarChart3,
      color: 'text-blue-500',
      premium: true,
      description: 'Análises detalhadas e insights de performance'
    },
    {
      id: 'ai',
      name: 'IA e Otimização',
      icon: Brain,
      color: 'text-purple-500',
      premium: true,
      description: 'Algoritmos inteligentes para otimização automática'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Funcionalidades Premium</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Recursos avançados disponíveis nos planos Professional e Enterprise
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === feature.id
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${feature.color}`} />
              <span className="font-medium">{feature.name}</span>
              {feature.premium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
            </button>
          );
        })}
      </div>

      {/* GPS Tracking */}
      {activeTab === 'gps' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="fleet-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Mapa em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Mapa interativo com localização dos veículos
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Integração com Google Maps disponível no plano Professional
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="fleet-card">
              <CardHeader>
                <CardTitle>Veículos Online</CardTitle>
              </CardHeader>
              <CardContent>
                {gpsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gpsData?.map((vehicle) => (
                      <div key={vehicle.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{vehicle.vehicleId}</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {vehicle.location.address}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Gauge className="h-3 w-3" />
                            {vehicle.speed} km/h
                          </span>
                          <span>
                            {new Date(vehicle.lastUpdate).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="fleet-card">
              <CardHeader>
                <CardTitle>Alertas GPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Geocerca</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">Veículo FRT-003 saiu da área autorizada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Velocidade</p>
                      <p className="text-sm text-red-600 dark:text-red-300">FRT-001 acima de 90 km/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Advanced Reports */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Eficiência de Combustível
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">
                    {reportsData?.fuelEfficiency.average} km/L
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    {reportsData?.fuelEfficiency.trend} vs mês anterior
                  </p>
                  <div className="mt-4 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500">Gráfico de Tendência</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Análise de Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white">
                    R$ {reportsData?.costAnalysis.totalCost.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Custos totais do mês</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Combustível</span>
                      <span>R$ {reportsData?.costAnalysis.breakdown.fuel.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Manutenção</span>
                      <span>R$ {reportsData?.costAnalysis.breakdown.maintenance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seguro</span>
                      <span>R$ {reportsData?.costAnalysis.breakdown.insurance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-purple-500" />
                Performance Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Quilometragem Total</p>
                    <p className="text-2xl font-bold">{reportsData?.performance.totalKm.toLocaleString()} km</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Velocidade Média</p>
                    <p className="text-2xl font-bold">{reportsData?.performance.avgSpeed} km/h</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Incidentes</p>
                    <p className="text-2xl font-bold text-green-600">{reportsData?.performance.incidents}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI and Optimization */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Otimização Inteligente de Rotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Economia Projetada
                  </h4>
                  <p className="text-2xl font-bold text-green-600">R$ 12.450/mês</p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Redução de 23% no consumo de combustível
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Otimizações Aplicadas:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Algoritmo de rota mais eficiente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Evitar horários de trânsito intenso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Consolidação automática de entregas</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Manutenção Preditiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Alerta Inteligente
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Veículo FRT-001 precisa de manutenção em ~15 dias
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    Baseado em: quilometragem, histórico e padrões de uso
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Previsões IA:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Troca de óleo</span>
                      <Badge variant="outline" className="text-yellow-600">7 dias</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revisão geral</span>
                      <Badge variant="outline" className="text-orange-600">15 dias</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pneus</span>
                      <Badge variant="outline" className="text-green-600">45 dias</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card md:col-span-2">
            <CardHeader>
              <CardTitle>Funcionalidades IA Disponíveis no Enterprise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <Camera className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Visão Computacional</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Análise automática de imagens para inspeção de veículos
                  </p>
                </div>
                <div className="text-center p-4">
                  <Smartphone className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">App Motorista IA</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Assistente virtual com dicas de direção econômica
                  </p>
                </div>
                <div className="text-center p-4">
                  <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Detecção de Riscos</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Algoritmos para identificar comportamentos perigosos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upgrade Prompt */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Desbloqueie Todo o Potencial</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Acesse todas essas funcionalidades premium fazendo upgrade para Professional ou Enterprise
          </p>
          <div className="flex justify-center gap-4">
            <Button className="fleet-button-primary">
              Ver Planos
            </Button>
            <Button variant="outline">
              Solicitar Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}