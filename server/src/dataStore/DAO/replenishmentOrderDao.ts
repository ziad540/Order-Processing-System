import { ReplenishmentOrder } from "../../../../shared/types.js";

export interface ReplenishmentOrderDao {
    getAllReplenishmentOrders(): Promise<ReplenishmentOrder[]>;
    updateReplenishmentOrderStatus(orderId: number, status: string, adminId?: number): Promise<void>;
}
