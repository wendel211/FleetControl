import { FleetActivity, ChartData, MapMarker } from "@/types";

export const mockActivities: FleetActivity[] = [
  {
    id: "1",
    type: "route_completed",
    title: "Route #RT-001 completed",
    description: "Vehicle FL-127 • 2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vehicleId: "FL-127",
    icon: "check",
    iconColor: "text-secondary",
  },
  {
    id: "2",
    type: "maintenance_scheduled",
    title: "Maintenance scheduled",
    description: "Vehicle FL-089 • 4 hours ago",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    vehicleId: "FL-089",
    icon: "wrench",
    iconColor: "text-amber-500",
  },
  {
    id: "3",
    type: "vehicle_added",
    title: "New vehicle added",
    description: "Vehicle FL-130 • 1 day ago",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    vehicleId: "FL-130",
    icon: "plus",
    iconColor: "text-primary",
  },
  {
    id: "4",
    type: "fuel_alert",
    title: "Fuel alert",
    description: "Vehicle FL-045 • 2 days ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    vehicleId: "FL-045",
    icon: "exclamation",
    iconColor: "text-red-500",
  },
];

export const mockPerformanceData: ChartData[] = [
  { name: "Mon", value: 32 },
  { name: "Tue", value: 40 },
  { name: "Wed", value: 28 },
  { name: "Thu", value: 48 },
  { name: "Fri", value: 36 },
  { name: "Sat", value: 44 },
  { name: "Sun", value: 52 },
];

export const mockFuelEfficiencyData: ChartData[] = [
  { name: "Jan", value: 8.5 },
  { name: "Feb", value: 8.2 },
  { name: "Mar", value: 8.7 },
  { name: "Apr", value: 8.4 },
  { name: "May", value: 8.1 },
  { name: "Jun", value: 8.3 },
];

export const mockUtilizationData: ChartData[] = [
  { name: "Active", value: 78, color: "#3B82F6" },
  { name: "Available", value: 32, color: "#10B981" },
  { name: "Maintenance", value: 12, color: "#8B5CF6" },
  { name: "Inactive", value: 5, color: "#F59E0B" },
];

export const mockMapMarkers: MapMarker[] = [
  {
    id: "1",
    lat: 47.6062,
    lng: -122.3321,
    type: "vehicle",
    status: "active",
    label: "FL-127 - Downtown Seattle",
  },
  {
    id: "2",
    lat: 47.6205,
    lng: -122.3493,
    type: "vehicle",
    status: "idle",
    label: "FL-089 - Service Center",
  },
  {
    id: "3",
    lat: 47.5952,
    lng: -122.3316,
    type: "vehicle",
    status: "alert",
    label: "FL-045 - Highway 99",
  },
  {
    id: "4",
    lat: 47.6097,
    lng: -122.3331,
    type: "depot",
    status: "active",
    label: "Main Depot",
  },
];
