import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  role: text("role").default("fleet_manager"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: text("vehicle_id").notNull().unique(),
  type: text("type").notNull(), // truck, van, car
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull(),
  vin: text("vin"),
  status: text("status").notNull().default("active"), // active, maintenance, inactive
  driverId: varchar("driver_id"),
  driverName: text("driver_name"),
  currentLocation: text("current_location"),
  fuelLevel: decimal("fuel_level", { precision: 5, scale: 2 }).default("100.00"),
  mileage: integer("mileage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: text("route_id").notNull().unique(),
  name: text("name").notNull(),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  driverName: text("driver_name"),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  stops: text("stops").array(),
  distance: decimal("distance", { precision: 8, scale: 2 }),
  estimatedDuration: integer("estimated_duration"), // in minutes
  status: text("status").notNull().default("planned"), // planned, in_progress, completed, cancelled
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const maintenance = pgTable("maintenance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, overdue
  cost: decimal("cost", { precision: 10, scale: 2 }),
  mileageAtService: integer("mileage_at_service"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription and billing tables
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: text("plan_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("active"), // active, canceled, past_due, incomplete
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usage = pgTable("usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  period: text("period").notNull(), // '2024-01'
  vehiclesUsed: integer("vehicles_used").default(0),
  apiCallsUsed: integer("api_calls_used").default(0),
  storageUsed: integer("storage_used").default(0), // in MB
  reportsGenerated: integer("reports_generated").default(0),
  smsNotifications: integer("sms_notifications").default(0),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  vehicleLimit: integer("vehicle_limit").notNull(), // -1 for unlimited
  features: text("features").array().notNull(),
  stripePriceId: text("stripe_price_id"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Maintenance = typeof maintenance.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Usage = typeof usage.$inferSelect;
export type Plan = typeof plans.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;


