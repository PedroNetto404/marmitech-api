const enumFactory = require("../../../utils/enum-factory");

const OrderStatus = enumFactory.create({
  /**
   * Pedido criado, mas ainda não confirmado.
   */
  PENDING: "pending",
  /**
   * Pedido confirmado pelo restaurante.
   */
  CONFIRMED: "confirmed",
  /**
   * Pedido em preparo.
   */
  PREPARING: "preparing",
  /**
   * Pedido pronto para entrega.
   */
  READY: "ready",
  /**
   * Pedido em rota de entrega.
   */
  DELIVERED: "delivered",
  /**
   * Pedido cancelado.
   */
  CANCELED: "canceled",
})

module.exports = OrderStatus;
