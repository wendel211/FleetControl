import { 
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Route, type InsertRoute,
  type Maintenance, type InsertMaintenance
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;

  // Routes
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route | undefined>;
  deleteRoute(id: string): Promise<boolean>;

  // Maintenance
  getMaintenance(): Promise<Maintenance[]>;
  getMaintenanceByVehicle(vehicleId: string): Promise<Maintenance[]>;
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  updateMaintenance(id: string, maintenance: Partial<InsertMaintenance>): Promise<Maintenance | undefined>;
  deleteMaintenance(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vehicles: Map<string, Vehicle>;
  private routes: Map<string, Route>;
  private maintenance: Map<string, Maintenance>;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.routes = new Map();
    this.maintenance = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      email: "admin@fleetpro.com",
      password: "password123",
      firstName: "John",
      lastName: "Smith",
      company: "FleetPro Solutions Inc.",
      role: "fleet_manager",
      createdAt: new Date(),
    };
    this.users.set(userId, user);

    // Create sample vehicles
    const vehicles = [
      {
        vehicleId: "FL-127",
        type: "truck",
        make: "Ford",
        model: "F-150",
        year: 2022,
        licensePlate: "WA-123-ABC",
        vin: "1FTFW1ET5NFC12345",
        status: "active",
        driverId: randomUUID(),
        driverName: "Mike Johnson",
        currentLocation: "Downtown Seattle",
        fuelLevel: "75.00",
        mileage: 45000,
      },
      {
        vehicleId: "FL-089",
        type: "van",
        make: "Mercedes",
        model: "Sprinter",
        year: 2021,
        licensePlate: "WA-456-DEF",
        vin: "WD3PE8CC5M5123456",
        status: "maintenance",
        driverId: randomUUID(),
        driverName: "Sarah Chen",
        currentLocation: "Service Center",
        fuelLevel: "25.00",
        mileage: 62000,
      },
      {
        vehicleId: "FL-045",
        type: "truck",
        make: "Chevrolet",
        model: "Silverado",
        year: 2023,
        licensePlate: "WA-789-GHI",
        vin: "1GCUYDED5NZ123456",
        status: "active",
        driverId: randomUUID(),
        driverName: "Tom Wilson",
        currentLocation: "Highway 99",
        fuelLevel: "20.00",
        mileage: 28000,
      },
    ];

    vehicles.forEach(vehicleData => {
      const id = randomUUID();
      const vehicle: Vehicle = {
        id,
        ...vehicleData,
        createdAt: new Date(),
      };
      this.vehicles.set(id, vehicle);
    });

    // Create sample routes
    const routesData = [
      {
        routeId: "RT-001",
        name: "Downtown Delivery Route",
        vehicleId: Array.from(this.vehicles.values())[0].id,
        driverName: "Mike Johnson",
        startLocation: "Warehouse District",
        endLocation: "Downtown Seattle",
        stops: ["Pike Place Market", "Pioneer Square", "Belltown"],
        distance: "45.5",
        estimatedDuration: 180,
        status: "in_progress",
        startTime: new Date(),
      },
      {
        routeId: "RT-002",
        name: "Northside Route",
        vehicleId: Array.from(this.vehicles.values())[2].id,
        driverName: "Tom Wilson",
        startLocation: "Distribution Center",
        endLocation: "Northgate",
        stops: ["University District", "Wallingford", "Fremont"],
        distance: "32.8",
        estimatedDuration: 150,
        status: "planned",
      },
    ];

    routesData.forEach(routeData => {
      const id = randomUUID();
      const route: Route = {
        id,
        ...routeData,
        createdAt: new Date(),
      };
      this.routes.set(id, route);
    });

    // Create sample maintenance records
    const maintenanceData = [
      {
        vehicleId: Array.from(this.vehicles.values())[1].id,
        serviceType: "Oil Change",
        description: "Regular oil change and filter replacement",
        scheduledDate: new Date("2024-12-28"),
        priority: "high",
        status: "overdue",
        cost: "75.00",
        mileageAtService: 45000,
        notes: "Use synthetic oil",
      },
      {
        vehicleId: Array.from(this.vehicles.values())[0].id,
        serviceType: "Tire Rotation",
        description: "Rotate tires and check pressure",
        scheduledDate: new Date("2025-01-05"),
        priority: "medium",
        status: "scheduled",
        cost: "45.00",
        mileageAtService: 52000,
      },
      {
        vehicleId: Array.from(this.vehicles.values())[2].id,
        serviceType: "Brake Inspection",
        description: "Inspect brake pads and rotors",
        scheduledDate: new Date("2025-01-10"),
        priority: "high",
        status: "scheduled",
        cost: "120.00",
        mileageAtService: 28000,
      },
    ];

    maintenanceData.forEach(maintenanceItem => {
      const id = randomUUID();
      const maintenance: Maintenance = {
        id,
        ...maintenanceItem,
        createdAt: new Date(),
      };
      this.maintenance.set(id, maintenance);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = { 
      ...insertVehicle, 
      id,
      createdAt: new Date(),
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: string, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    
    const updatedVehicle = { ...vehicle, ...updateData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Route methods
  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { 
      ...insertRoute, 
      id,
      createdAt: new Date(),
    };
    this.routes.set(id, route);
    return route;
  }

  async updateRoute(id: string, updateData: Partial<InsertRoute>): Promise<Route | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const updatedRoute = { ...route, ...updateData };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }

  async deleteRoute(id: string): Promise<boolean> {
    return this.routes.delete(id);
  }

  // Maintenance methods
  async getMaintenance(): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values());
  }

  async getMaintenanceByVehicle(vehicleId: string): Promise<Maintenance[]> {
    return Array.from(this.maintenance.values()).filter(m => m.vehicleId === vehicleId);
  }

  async createMaintenance(insertMaintenance: InsertMaintenance): Promise<Maintenance> {
    const id = randomUUID();
    const maintenance: Maintenance = { 
      ...insertMaintenance, 
      id,
      createdAt: new Date(),
    };
    this.maintenance.set(id, maintenance);
    return maintenance;
  }

  async updateMaintenance(id: string, updateData: Partial<InsertMaintenance>): Promise<Maintenance | undefined> {
    const maintenance = this.maintenance.get(id);
    if (!maintenance) return undefined;
    
    const updatedMaintenance = { ...maintenance, ...updateData };
    this.maintenance.set(id, updatedMaintenance);
    return updatedMaintenance;
  }

  async deleteMaintenance(id: string): Promise<boolean> {
    return this.maintenance.delete(id);
  }
}

export const storage = new MemStorage();
