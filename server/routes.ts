// server/routes.ts

import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertVehicleSchema,
  insertRouteSchema,
  insertMaintenanceSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // 1️⃣ Verifica a chave Stripe só agora, depois que dotenv foi carregado no index.ts
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
  }

  // 2️⃣ Cria o client Stripe com a versão correta
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });

  // Definições de planos
  const PLANS = {
    starter: {
      priceId: "price_starter_monthly",
      price: 99,
      vehicleLimit: 5,
      features: ["dashboard", "maintenance", "basic_reports"],
    },
    professional: {
      priceId: "price_professional_monthly",
      price: 299,
      vehicleLimit: 25,
      features: [
        "dashboard",
        "maintenance",
        "gps",
        "advanced_reports",
        "routes",
        "api_basic",
      ],
    },
    enterprise: {
      priceId: "price_enterprise_monthly",
      price: 799,
      vehicleLimit: -1,
      features: ["all"],
    },
  };

  // ——————————————
  // Rotas de Autenticação
  // ——————————————
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user =
        (await storage.getUserByEmail(email)) ||
        (await storage.createUser({
          email,
          password,
          firstName: "Demo",
          lastName: "User",
          company: "Demo Company",
          role: "fleet_manager",
        }));
      res.json({ user: { ...user, password: undefined } });
    } catch {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // ——————————————
  // Rotas de Veículos
  // ——————————————
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
      res.json(vehicle);
    } catch {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });
  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.json(vehicle);
    } catch {
      res.status(400).json({ message: "Failed to create vehicle" });
    }
  });
  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const updateData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(req.params.id, updateData);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
      res.json(vehicle);
    } catch {
      res.status(400).json({ message: "Failed to update vehicle" });
    }
  });
  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVehicle(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Vehicle not found" });
      res.json({ message: "Vehicle deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // ——————————————
  // Rotas de Rotas
  // ——————————————
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });
  app.post("/api/routes", async (req, res) => {
    try {
      const routeData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(routeData);
      res.json(route);
    } catch {
      res.status(400).json({ message: "Failed to create route" });
    }
  });
  app.patch("/api/routes/:id", async (req, res) => {
    try {
      const updateData = insertRouteSchema.partial().parse(req.body);
      const route = await storage.updateRoute(req.params.id, updateData);
      if (!route) return res.status(404).json({ message: "Route not found" });
      res.json(route);
    } catch {
      res.status(400).json({ message: "Failed to update route" });
    }
  });

  // ——————————————
  // Rotas de Manutenção
  // ——————————————
  app.get("/api/maintenance", async (req, res) => {
    try {
      const maintenance = await storage.getMaintenance();
      res.json(maintenance);
    } catch {
      res.status(500).json({ message: "Failed to fetch maintenance records" });
    }
  });
  app.get("/api/maintenance/vehicle/:vehicleId", async (req, res) => {
    try {
      const records = await storage.getMaintenanceByVehicle(req.params.vehicleId);
      res.json(records);
    } catch {
      res.status(500).json({ message: "Failed to fetch maintenance records" });
    }
  });
  app.post("/api/maintenance", async (req, res) => {
    try {
      const maintenanceData = insertMaintenanceSchema.parse(req.body);
      const maintenance = await storage.createMaintenance(maintenanceData);
      res.json(maintenance);
    } catch {
      res.status(400).json({ message: "Failed to create maintenance record" });
    }
  });
  app.patch("/api/maintenance/:id", async (req, res) => {
    try {
      const updateData = insertMaintenanceSchema.partial().parse(req.body);
      const maintenance = await storage.updateMaintenance(req.params.id, updateData);
      if (!maintenance)
        return res.status(404).json({ message: "Maintenance record not found" });
      res.json(maintenance);
    } catch {
      res.status(400).json({ message: "Failed to update maintenance record" });
    }
  });

  // ——————————————
  // Estatísticas do Dashboard
  // ——————————————
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      const routes = await storage.getRoutes();
      const maintenance = await storage.getMaintenance();
      const stats = {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === "active").length,
        activeRoutes: routes.filter(r => r.status === "in_progress").length,
        maintenanceDue: maintenance.filter(m => m.status === "scheduled" || m.status === "overdue").length,
        maintenanceOverdue: maintenance.filter(m => m.status === "overdue").length,
        totalDistance: routes.reduce((sum, r) => sum + parseFloat(r.distance || "0"), 0),
        averageFuel:
          vehicles.reduce((sum, v) => sum + parseFloat(v.fuelLevel || "0"), 0) /
          (vehicles.length || 1),
      };
      res.json(stats);
    } catch {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // ——————————————
  // Assinaturas e Uso
  // ——————————————
  app.get("/api/subscription", async (_req, res) => {
    res.json({
      id: "sub_demo",
      planId: "professional",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    });
  });
  app.get("/api/usage", async (_req, res) => {
    const vehicles = await storage.getVehicles();
    res.json({
      vehiclesUsed: vehicles.length,
      apiCalls: 1250,
      reports: 15,
      smsNotifications: 42,
    });
  });

  // ——————————————
  // Checkout Stripe
  // ——————————————
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { planId } = req.body;
      const plan = PLANS[planId as keyof typeof PLANS];
      if (!plan) return res.status(400).json({ message: "Invalid plan" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `Plano ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
                description: `Gestão de frota para até ${
                  plan.vehicleLimit === -1 ? "ilimitados" : plan.vehicleLimit
                } veículos`,
              },
              unit_amount: plan.price * 100,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/billing?success=true`,
        cancel_url: `${req.headers.origin}/billing?canceled=true`,
        metadata: { planId },
      });

      res.json({ url: session.url });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error creating subscription: " + err.message });
    }
  });

  app.post("/api/cancel-subscription", async (_req, res) => {
    res.json({ message: "Subscription cancelled successfully" });
  });

  // ——————————————
  // Relatórios Avançados e GPS
  // ——————————————
  app.get("/api/advanced-reports", async (_req, res) => {
    res.json({
      fuelEfficiency: { average: 12.5, trend: "+2.3%", data: [10.2, 11.8, 12.1, 12.5, 13.2] },
      costAnalysis: { totalCost: 45680, breakdown: { fuel: 32400, maintenance: 8900, insurance: 4380 } },
      performance: { totalKm: 156790, avgSpeed: 68, incidents: 2 },
    });
  });

  app.get("/api/gps-tracking", async (_req, res) => {
    const vehicles = await storage.getVehicles();
    const trackingData = vehicles.map(v => ({
      id: v.id,
      vehicleId: v.vehicleId,
      location: {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
        address: v.currentLocation || "São Paulo, SP",
      },
      speed: Math.floor(Math.random() * 80) + 20,
      heading: Math.floor(Math.random() * 360),
      lastUpdate: new Date().toISOString(),
    }));
    res.json(trackingData);
  });

  // Cria e retorna o servidor HTTP
  const httpServer = createServer(app);
  return httpServer;
}
