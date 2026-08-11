// Day 4 (Data & Analytics) seed dataset - a simulated food-delivery table.
// Generated deterministically; aggregates below are verified (see the task
// definitions in lib/content/domains/data-analytics.ts for expected answers).

export interface FoodDeliveryOrderRow {
  orderId: string;
  customer: string;
  city: string;
  restaurant: string;
  category: string;
  orderValue: number;
  orderDate: string;
  deliveryMinutes: number;
  rating: number;
}

export const FOOD_DELIVERY_TABLE = "orders";

export const FOOD_DELIVERY_SCHEMA_SQL = `
CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  city TEXT NOT NULL,
  restaurant TEXT NOT NULL,
  category TEXT NOT NULL,
  order_value REAL NOT NULL,
  order_date TEXT NOT NULL,
  delivery_minutes INTEGER NOT NULL,
  rating INTEGER NOT NULL
);
`;

export const FOOD_DELIVERY_ROWS: FoodDeliveryOrderRow[] = [
  { orderId: "ORD-001", customer: "B. Chen", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 263, orderDate: "2026-06-01", deliveryMinutes: 32, rating: 4 },
  { orderId: "ORD-002", customer: "C. Silva", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 269, orderDate: "2026-06-01", deliveryMinutes: 39, rating: 5 },
  { orderId: "ORD-003", customer: "D. Okafor", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 285, orderDate: "2026-06-01", deliveryMinutes: 46, rating: 5 },
  { orderId: "ORD-004", customer: "E. Novak", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 291, orderDate: "2026-06-02", deliveryMinutes: 28, rating: 4 },
  { orderId: "ORD-005", customer: "F. Haddad", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 307, orderDate: "2026-06-02", deliveryMinutes: 35, rating: 3 },
  { orderId: "ORD-006", customer: "G. Petrov", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 313, orderDate: "2026-06-02", deliveryMinutes: 42, rating: 5 },
  { orderId: "ORD-007", customer: "H. Kim", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 329, orderDate: "2026-06-02", deliveryMinutes: 24, rating: 3 },
  { orderId: "ORD-008", customer: "I. Rossi", city: "Rivertown", restaurant: "Golden Wok", category: "Chinese", orderValue: 335, orderDate: "2026-06-03", deliveryMinutes: 31, rating: 4 },
  { orderId: "ORD-009", customer: "J. Dubois", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 303, orderDate: "2026-06-03", deliveryMinutes: 35, rating: 4 },
  { orderId: "ORD-010", customer: "K. Nair", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 311, orderDate: "2026-06-03", deliveryMinutes: 42, rating: 3 },
  { orderId: "ORD-011", customer: "L. Kowalski", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 329, orderDate: "2026-06-03", deliveryMinutes: 24, rating: 5 },
  { orderId: "ORD-012", customer: "A. Rao", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 337, orderDate: "2026-06-04", deliveryMinutes: 31, rating: 3 },
  { orderId: "ORD-013", customer: "B. Chen", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 355, orderDate: "2026-06-04", deliveryMinutes: 38, rating: 4 },
  { orderId: "ORD-014", customer: "C. Silva", city: "Rivertown", restaurant: "Pepper & Vine", category: "Indian", orderValue: 363, orderDate: "2026-06-04", deliveryMinutes: 45, rating: 4 },
  { orderId: "ORD-015", customer: "D. Okafor", city: "Rivertown", restaurant: "Sweet Note", category: "Desserts", orderValue: 153, orderDate: "2026-06-04", deliveryMinutes: 32, rating: 4 },
  { orderId: "ORD-016", customer: "E. Novak", city: "Rivertown", restaurant: "Sweet Note", category: "Desserts", orderValue: 157, orderDate: "2026-06-05", deliveryMinutes: 39, rating: 5 },
  { orderId: "ORD-017", customer: "F. Haddad", city: "Rivertown", restaurant: "Sweet Note", category: "Desserts", orderValue: 171, orderDate: "2026-06-05", deliveryMinutes: 46, rating: 5 },
  { orderId: "ORD-018", customer: "G. Petrov", city: "Rivertown", restaurant: "Sweet Note", category: "Desserts", orderValue: 175, orderDate: "2026-06-05", deliveryMinutes: 28, rating: 4 },
  { orderId: "ORD-019", customer: "H. Kim", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 283, orderDate: "2026-06-05", deliveryMinutes: 35, rating: 4 },
  { orderId: "ORD-020", customer: "I. Rossi", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 290, orderDate: "2026-06-06", deliveryMinutes: 42, rating: 3 },
  { orderId: "ORD-021", customer: "J. Dubois", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 307, orderDate: "2026-06-06", deliveryMinutes: 24, rating: 5 },
  { orderId: "ORD-022", customer: "K. Nair", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 314, orderDate: "2026-06-06", deliveryMinutes: 31, rating: 3 },
  { orderId: "ORD-023", customer: "L. Kowalski", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 331, orderDate: "2026-06-06", deliveryMinutes: 38, rating: 4 },
  { orderId: "ORD-024", customer: "A. Rao", city: "Bayport", restaurant: "Crust Culture", category: "Pizza", orderValue: 338, orderDate: "2026-06-07", deliveryMinutes: 45, rating: 4 },
  { orderId: "ORD-025", customer: "B. Chen", city: "Bayport", restaurant: "Patty House", category: "Burgers", orderValue: 263, orderDate: "2026-06-07", deliveryMinutes: 33, rating: 5 },
  { orderId: "ORD-026", customer: "C. Silva", city: "Bayport", restaurant: "Patty House", category: "Burgers", orderValue: 268, orderDate: "2026-06-07", deliveryMinutes: 40, rating: 5 },
  { orderId: "ORD-027", customer: "D. Okafor", city: "Bayport", restaurant: "Patty House", category: "Burgers", orderValue: 283, orderDate: "2026-06-07", deliveryMinutes: 22, rating: 4 },
  { orderId: "ORD-028", customer: "E. Novak", city: "Bayport", restaurant: "Patty House", category: "Burgers", orderValue: 288, orderDate: "2026-06-08", deliveryMinutes: 29, rating: 3 },
  { orderId: "ORD-029", customer: "F. Haddad", city: "Bayport", restaurant: "Patty House", category: "Burgers", orderValue: 303, orderDate: "2026-06-08", deliveryMinutes: 36, rating: 5 },
  { orderId: "ORD-030", customer: "G. Petrov", city: "Lakeside", restaurant: "Sushi Loop", category: "Sushi", orderValue: 383, orderDate: "2026-06-08", deliveryMinutes: 32, rating: 4 },
  { orderId: "ORD-031", customer: "H. Kim", city: "Lakeside", restaurant: "Sushi Loop", category: "Sushi", orderValue: 392, orderDate: "2026-06-08", deliveryMinutes: 39, rating: 5 },
  { orderId: "ORD-032", customer: "I. Rossi", city: "Lakeside", restaurant: "Sushi Loop", category: "Sushi", orderValue: 411, orderDate: "2026-06-09", deliveryMinutes: 46, rating: 5 },
  { orderId: "ORD-033", customer: "J. Dubois", city: "Lakeside", restaurant: "Sushi Loop", category: "Sushi", orderValue: 420, orderDate: "2026-06-09", deliveryMinutes: 28, rating: 4 },
  { orderId: "ORD-034", customer: "K. Nair", city: "Lakeside", restaurant: "Sushi Loop", category: "Sushi", orderValue: 439, orderDate: "2026-06-09", deliveryMinutes: 35, rating: 3 },
  { orderId: "ORD-035", customer: "L. Kowalski", city: "Hillcrest", restaurant: "Green Bowl", category: "Salads", orderValue: 213, orderDate: "2026-06-09", deliveryMinutes: 32, rating: 4 },
  { orderId: "ORD-036", customer: "A. Rao", city: "Hillcrest", restaurant: "Green Bowl", category: "Salads", orderValue: 216, orderDate: "2026-06-10", deliveryMinutes: 39, rating: 5 },
  { orderId: "ORD-037", customer: "B. Chen", city: "Hillcrest", restaurant: "Green Bowl", category: "Salads", orderValue: 229, orderDate: "2026-06-10", deliveryMinutes: 46, rating: 5 },
  { orderId: "ORD-038", customer: "C. Silva", city: "Hillcrest", restaurant: "Green Bowl", category: "Salads", orderValue: 232, orderDate: "2026-06-10", deliveryMinutes: 28, rating: 4 },
  { orderId: "ORD-039", customer: "D. Okafor", city: "Northgate", restaurant: "Taco Field", category: "Mexican", orderValue: 243, orderDate: "2026-06-10", deliveryMinutes: 32, rating: 4 },
  { orderId: "ORD-040", customer: "E. Novak", city: "Northgate", restaurant: "Taco Field", category: "Mexican", orderValue: 248, orderDate: "2026-06-11", deliveryMinutes: 39, rating: 5 },
  { orderId: "ORD-041", customer: "F. Haddad", city: "Northgate", restaurant: "Taco Field", category: "Mexican", orderValue: 263, orderDate: "2026-06-11", deliveryMinutes: 46, rating: 5 },
  { orderId: "ORD-042", customer: "G. Petrov", city: "Northgate", restaurant: "Taco Field", category: "Mexican", orderValue: 268, orderDate: "2026-06-11", deliveryMinutes: 28, rating: 4 },
];

// Verified aggregates (see scratch generator) - used by task configs:
//   Highest-revenue city: Rivertown (5046)
//   Highest order-count restaurant: Golden Wok (8 orders)
//   Average order value: 292.17 (12271 / 42)
//   Notable pattern: Lakeside/Sushi Loop has far fewer orders than Rivertown
//   but the highest average order value (~409), a good "unusual pattern" find.
