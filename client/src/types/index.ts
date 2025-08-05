export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  activeRoutes: number;
  maintenanceDue: number;
  maintenanceOverdue: number;
  totalDistance: number;
  averageFuel: number;
}

export interface FleetActivity {
  id: string;
  type: 'route_completed' | 'maintenance_scheduled' | 'vehicle_added' | 'fuel_alert';
  title: string;
  description: string;
  timestamp: Date;
  vehicleId?: string;
  icon: string;
  iconColor: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'vehicle' | 'stop' | 'depot';
  status: 'active' | 'idle' | 'alert';
  label: string;
}
