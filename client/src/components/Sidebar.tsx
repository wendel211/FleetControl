import { Link, useLocation } from "wouter";
import { Truck, Home, Route, Wrench, MapPin, BarChart3, Settings, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Painel Inicial", href: "/dashboard", icon: Home, color: "text-blue-500" },
  { name: "Veículos", href: "/vehicles", icon: Truck, color: "text-green-500" },
  { name: "Rotas", href: "/routes", icon: Route, color: "text-purple-500" },
  { name: "Manutenção", href: "/maintenance", icon: Wrench, color: "text-orange-500" },
  { name: "Rastreamento", href: "/tracking", icon: MapPin, color: "text-red-500" },
  { name: "Relatórios", href: "/reports", icon: BarChart3, color: "text-indigo-500" },
  { name: "Assinatura", href: "/billing", icon: CreditCard, color: "text-yellow-500" },
  { name: "Configurações", href: "/settings", icon: Settings, color: "text-gray-500" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transform transition-all duration-300 z-40 shadow-2xl",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Truck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">GestãoFrota</h1>
            <p className="text-sm text-slate-400">Sistema de Gestão</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-xs truncate">{user?.company}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-l-4 border-blue-500 text-blue-400 shadow-lg" 
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  )}
                  onClick={onClose}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-blue-400" : item.color
                    )} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive ? "text-blue-400 rotate-90" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-xs text-slate-500">GestãoFrota v2.0</p>
          <p className="text-xs text-slate-600 mt-1">© 2025 Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
