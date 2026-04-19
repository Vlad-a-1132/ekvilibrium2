import type { OrderStatus } from "@prisma/client";

/** Порядок статусов в селекте админки и в логике витрины. */
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];
