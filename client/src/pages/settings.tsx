import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, Key, LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    company: user?.company || "",
    jobTitle: "Fleet Manager",
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const handleProfileSave = () => {
    toast({
      title: "Perfil Atualizado",
      description: "Suas informações de perfil foram salvas com sucesso.",
    });
  };

  const handleNotificationChange = (type: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast({
      title: "Configurações de Notificação Atualizadas",
      description: `Notificações por ${type === 'email' ? 'email' : type === 'push' ? 'push' : 'SMS'} ${value ? "ativadas" : "desativadas"}.`,
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Alterar Senha",
      description: "Funcionalidade de alteração de senha seria implementada aqui.",
    });
  };

  const handleSignOut = () => {
    logout();
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Configurações</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Gerencie suas preferências e configurações da conta</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face" />
                  <AvatarFallback className="text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={profileData.jobTitle}
                  onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-2"
                />
              </div>
              
              <Button onClick={handleProfileSave} className="fleet-button-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Settings */}
        <div className="space-y-6">
          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Toggle dark/light theme</div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-4">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive email updates</div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(value) => handleNotificationChange("email", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-muted-foreground">Browser notifications</div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(value) => handleNotificationChange("push", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Text message alerts</div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(value) => handleNotificationChange("sms", value)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="language">Language</Label>
                <select 
                  id="language"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background mt-2"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background mt-2"
                >
                  <option>Pacific Time (UTC-8)</option>
                  <option>Mountain Time (UTC-7)</option>
                  <option>Central Time (UTC-6)</option>
                  <option>Eastern Time (UTC-5)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="fleet-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handlePasswordChange}
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Settings */}
      <Card className="fleet-card">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Default Views</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="defaultDashboard">Default Dashboard View</Label>
                  <select 
                    id="defaultDashboard"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background mt-2"
                  >
                    <option>Fleet Overview</option>
                    <option>Performance Metrics</option>
                    <option>Recent Activity</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="defaultMapView">Default Map View</Label>
                  <select 
                    id="defaultMapView"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background mt-2"
                  >
                    <option>Satellite</option>
                    <option>Road Map</option>
                    <option>Terrain</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Data Refresh</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="refreshInterval">Auto Refresh Interval</Label>
                  <select 
                    id="refreshInterval"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background mt-2"
                  >
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>Manual only</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Real-time Updates</div>
                    <div className="text-sm text-muted-foreground">Live data streaming</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
