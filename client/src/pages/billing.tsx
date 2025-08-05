import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Users, 
  BarChart3,
  Shield,
  Crown
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  vehicleLimit: number;
  features: string[];
  popular?: boolean;
  description: string;
  icon: React.ComponentType<any>;
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Usage {
  vehiclesUsed: number;
  apiCalls: number;
  reports: number;
  smsNotifications: number;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    vehicleLimit: 5,
    description: 'Ideal para pequenas empresas',
    icon: Users,
    features: [
      'Até 5 veículos',
      'Dashboard básico',
      'Gestão de manutenção',
      'Relatórios simples',
      'Suporte por email'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    vehicleLimit: 25,
    description: 'Para empresas em crescimento',
    icon: BarChart3,
    popular: true,
    features: [
      'Até 25 veículos',
      'Rastreamento GPS',
      'Relatórios avançados',
      'Otimização de rotas',
      'API básica',
      'Suporte prioritário',
      'Alertas em tempo real'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    vehicleLimit: -1,
    description: 'Para grandes frotas',
    icon: Crown,
    features: [
      'Veículos ilimitados',
      'IA para otimização',
      'White-label',
      'API completa',
      'Integrações personalizadas',
      'Suporte 24/7',
      'Manager dedicado',
      'Análise preditiva'
    ]
  }
];

export default function Billing() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const { data: subscription, isLoading: loadingSubscription } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
  });

  const { data: usage } = useQuery<Usage>({
    queryKey: ["/api/usage"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/create-subscription", { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Assinatura Criada",
          description: "Sua assinatura foi processada com sucesso!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      }
    },
    onError: () => {
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cancel-subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assinatura Cancelada",
        description: "Sua assinatura será cancelada ao final do período atual.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
  });

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    subscribeMutation.mutate(planId);
  };

  const currentPlan = plans.find(plan => plan.id === subscription?.planId);

  if (loadingSubscription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Assinatura e Faturamento</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gerencie sua assinatura e pagamentos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Assinatura e Faturamento</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Escolha o plano ideal para sua frota</p>
      </div>

      {/* Current Subscription Status */}
      {subscription && (
        <Card className="fleet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Assinatura Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currentPlan?.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  R$ {currentPlan?.price}/mês
                </p>
                <p className="text-sm text-slate-500">
                  Próxima cobrança: {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {subscription.status === 'active' ? 'Ativa' : 'Pendente'}
                </Badge>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-sm text-red-600 mt-1">Cancelará em breve</p>
                )}
              </div>
            </div>
            
            {usage && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Uso Atual</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Veículos</p>
                    <p className="font-semibold">{usage?.vehiclesUsed || 0}/{currentPlan?.vehicleLimit === -1 ? '∞' : currentPlan?.vehicleLimit}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Chamadas API</p>
                    <p className="font-semibold">{usage?.apiCalls || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Relatórios</p>
                    <p className="font-semibold">{usage?.reports || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">SMS Enviados</p>
                    <p className="font-semibold">{usage?.smsNotifications || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <Button 
                variant="outline" 
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="mt-4"
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar Assinatura'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          Escolha Seu Plano
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = subscription?.planId === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  plan.popular ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                } ${isCurrentPlan ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Mais Popular
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      R$ {plan.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">/mês</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Plano Atual
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribeMutation.isPending && selectedPlan === plan.id}
                      className={`w-full ${plan.popular ? 'fleet-button-primary' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {subscribeMutation.isPending && selectedPlan === plan.id ? (
                        'Processando...'
                      ) : subscription ? (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Fazer Upgrade
                        </>
                      ) : (
                        'Assinar Agora'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add-ons Section */}
      <Card className="fleet-card">
        <CardHeader>
          <CardTitle>Complementos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Combustível Premium</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Análise avançada de consumo</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">+R$ 49/mês</p>
                <Button size="sm" variant="outline">Adicionar</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Segurança Avançada</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Alertas e câmeras</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">+R$ 79/mês</p>
                <Button size="sm" variant="outline">Adicionar</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Compliance</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Relatórios regulatórios</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">+R$ 99/mês</p>
                <Button size="sm" variant="outline">Adicionar</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Mobile Premium</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">App avançado para motoristas</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">+R$ 29/mês</p>
                <Button size="sm" variant="outline">Adicionar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Custom */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Precisa de Algo Personalizado?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Entre em contato para soluções customizadas, on-premise ou integrações específicas
          </p>
          <Button variant="outline">
            Falar com Especialista
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}