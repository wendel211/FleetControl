import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("admin@fleetpro.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      setLocation("/dashboard");
      toast({
        title: "Bem-vindo ao GestãoFrota",
        description: "Você entrou com sucesso na sua conta.",
      });
    } catch (error) {
      toast({
        title: "Falha no Login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-4">
      <div className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-xl mb-4 mx-auto">
            <Truck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Bem-vindo ao GestãoFrota</CardTitle>
          <p className="text-muted-foreground mt-2">Entre para gerenciar sua frota</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Endereço de Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gestaofrota.com"
                className="fleet-input mt-2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="fleet-input pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
              </div>
              <Button variant="link" className="text-sm text-primary p-0">
                Esqueceu a senha?
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full fleet-button-primary"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Não tem uma conta? </span>
              <Button 
                variant="link" 
                className="text-sm text-primary p-0 font-medium"
                onClick={() => setLocation("/register")}
              >
                Criar conta
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
