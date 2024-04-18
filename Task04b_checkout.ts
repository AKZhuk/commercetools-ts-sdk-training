import { AddressDraft } from "@commercetools/platform-sdk";
import * as checkout from "./handson/order";
import { createPayment } from "./handson/payment";
import { log } from "./utils/logger";

const customerKey = "tt-customer";
const cartId = "251d93de-fffb-4af1-802d-2fde3af1f12a";
const orderId = "727edb15-27d4-453e-a129-7f36f4a9c5d7";

const paymentDraft = {
    key: "payment" + Math.random().toString(36).substring(2, 7),
    amountPlanned: {
        currencyCode: "EUR",
        centAmount: 5000
    },
    pspName: "We_Do_Payments",
    pspMethod: "CREDIT_CARD",
    interfaceId: "we_pay_73636" + Math.random(), // Must be unique.
    interactionId: "pay82626" + Math.random()
}

export const addressDraft: AddressDraft = { country: "DE", city: "Munich" }

// create a cart and update the cartId variable
// checkout.createCart(customerKey).then(log).catch(log);

// checkout.addLineItemsToCart(cartId, ["GRCG-01", "GRCG-01"]).then(log).catch(log);

// checkout.addDiscountCodeToCart(cartId, "SUMMER").then(log).catch(log);
// checkout.recalculate(cartId).then(log).catch(log);
// checkout.addShippingAddressToCart(cartId, addressDraft)
// checkout.setShippingMethod(cartId).then(log).catch(log);

// create order from cart and update the orderId
// checkout.createOrderFromCart(cartId).then(log).catch(log);

// checkout.getOrderById(orderId).then(log).catch(log);

// set order state to confirmed and custom workflow state to order packed
// checkout.setOrderState(orderId, "Confirmed").then(log).catch(log);
// checkout.updateOrderCustomState(orderId, "tt-order-packed").then(log).catch(log);

const checkoutProcess = async () => {

    let emptyCart = await checkout.createCart(customerKey);

    let filledCart = await checkout.addLineItemsToCart(
      emptyCart.body.id, ["GRCG-01", "GRCG-01"]
    );

    filledCart = await checkout.addDiscountCodeToCart(
      filledCart.body.id, "TEST-18"
    );


    filledCart = await checkout.recalculate(filledCart.body.id);
    filledCart = await checkout.setShippingMethod(filledCart.body.id);

    const payment = await createPayment(paymentDraft);
    filledCart = await checkout.addPaymentToCart(filledCart.body.id, payment.body.id);

    let order = await checkout.createOrderFromCart(filledCart.body.id);
    order = await checkout.setOrderState(order.body.id, "Confirmed");
    order = await checkout.updateOrderCustomState(order.body.id, "tt-order-packed");
    if (order) {
        return {
            status: 201,
            message: "order created: " + order.body.id,
        };
    }
};

checkoutProcess().then(log).catch(log);
