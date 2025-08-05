import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun, Bell, LogOut, User } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Painel de Controle</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Gerencie sua frota com eficiência</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={toggleTheme}
          title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              <Avatar className="h-9 w-9 ring-2 ring-slate-200 dark:ring-slate-700">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-700">
              <User className="mr-2 h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-800 dark:text-white">Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair da Conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
