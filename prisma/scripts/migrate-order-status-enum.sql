-- Однократная миграция: PENDING → NEW, добавление CONFIRMED.
-- Запуск: npx prisma db execute --file prisma/scripts/migrate-order-status-enum.sql

ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED');

ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING (
    CASE "status"::text
      WHEN 'PENDING' THEN 'NEW'::"OrderStatus"
      WHEN 'PROCESSING' THEN 'PROCESSING'::"OrderStatus"
      WHEN 'SHIPPED' THEN 'SHIPPED'::"OrderStatus"
      WHEN 'COMPLETED' THEN 'COMPLETED'::"OrderStatus"
      WHEN 'CANCELLED' THEN 'CANCELLED'::"OrderStatus"
      ELSE 'NEW'::"OrderStatus"
    END
  );

ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'NEW'::"OrderStatus";

DROP TYPE "OrderStatus_old";
