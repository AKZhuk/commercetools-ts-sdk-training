import {
  ClientResponse,
  Cart,
  CustomerSignin,
  CustomerSignInResult,
  Order,
  OrderFromCartDraft,
  OrderState,
  CartUpdateAction,
  CartAddLineItemAction,
  CartResourceIdentifier,
  AddressDraft,
} from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { getCustomerByKey } from './customer';
import { addressDraft } from '../Task04b_checkout';

export const createCart = (customerKey: string): Promise<ClientResponse<Cart>> => {
  return apiRoot
    .carts()
    .post({
      body: {
        key: 'az-cart-6',
        currency: 'EUR',
        country: 'DE',
        shippingAddress: addressDraft,
      },
    })
    .execute();
};

export const addShippingAddressToCart = async (
  cartId: string,
  address: AddressDraft,
): Promise<ClientResponse<Cart>> => {
  const cart = await getCartById(cartId);

  return await apiRoot
    .carts()
    .withKey({ key: cart.body.key! })
    .post({ body: { version: cart.body.version, actions: [{ action: 'setShippingAddress', address }] } })
    .execute();
};

export const createAnonymousCart = (): Promise<ClientResponse<Cart>> =>
    apiRoot
        .carts()
        .post({
            body: {
            currency: 'EUR',
            country: 'DE',
          },
        })
        .execute();

export const customerSignIn = (
  customerDetails: CustomerSignin,
): Promise<ClientResponse<CustomerSignInResult>> =>
    apiRoot
        .login()
        .post({
          body: customerDetails,
        })
        .execute();

export const getCartById = (ID: string): Promise<ClientResponse<Cart>> =>
  apiRoot.carts().withId({ ID }).get().execute();

export const addLineItemsToCart = async (
  cartId: string,
  arrayOfSKUs: Array<string>,
): Promise<ClientResponse<Cart>> => {
  const actions: CartUpdateAction[] = arrayOfSKUs.map((sku) => ({
    action: 'addLineItem',
    sku,
  }));

  const cart = await getCartById(cartId);

  return await apiRoot
        .carts()
      .withKey({ key: cart.body.key! })
      .post({ body: { version: cart.body.version, actions } })
        .execute();
};

export const addDiscountCodeToCart = async (
  cartId: string,
  discountCode: string,
): Promise<ClientResponse<Cart>> => {
  const cart = await getCartById(cartId);

  return await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cart.body.version,
            actions: [
              {
                action: 'addDiscountCode',
                code: discountCode,
              },
            ],
          },
        })
    .execute();
};

export const recalculate = (cartId: string): Promise<ClientResponse<Cart>> =>
  getCartById(cartId).then((cart) =>
        apiRoot
            .carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version: cart.body.version,
                actions: [
                  {
                    action: 'recalculate',
                  },
                ],
              },
            })
        .execute(),
    );

export const setShippingMethod = async (cartId: string): Promise<ClientResponse<Cart>> => {
    const matchingShippingMethod = await apiRoot
        .shippingMethods()
        .matchingCart()
        .get({
            queryArgs: {
            cartId,
          },
        })
        .execute()
      .then((response) => response.body.results[0]);

  return getCartById(cartId).then((cart) =>
        apiRoot
            .carts()
            .withId({ ID: cartId })
            .post({
                body: {
                    version: cart.body.version,
                actions: [
                  {
                    action: 'setShippingMethod',
                    shippingMethod: {
                      typeId: 'shipping-method',
                      id: matchingShippingMethod.id,
                    },
                  },
                ],
              },
            })
        .execute(),
    );
};

export const createOrderFromCart = async (cartId: string): Promise<ClientResponse<Order>> => {
  const cart = getCartById(cartId);
  return apiRoot
    .orders()
    .post({
      body: {
        version: (await cart).body.version,
        cart: {
          typeId: 'cart',
          id: cartId,
        },
      },
    })
    .execute();
};

const createOrderFromCartDraft = (cartId: string): Promise<OrderFromCartDraft> =>
  getCartById(cartId).then((cart) => {
        return {
            cart: {
                id: cartId,
            typeId: 'cart',
            },
            version: cart.body.version,
        };
    });

export const getOrderById = (ID: string): Promise<ClientResponse<Order>> =>
  apiRoot.orders().withId({ ID }).get().execute();

export const updateOrderCustomState = (
  orderId: string,
  customStateKey: string,
): Promise<ClientResponse<Order>> => {
  return getOrderById(orderId).then((order) =>
      apiRoot
            .orders()
            .withId({ ID: orderId })
            .post({
                body: {
                    version: order.body.version,
                actions: [
                  {
                    action: 'transitionState',
                    state: {
                      key: customStateKey,
                      typeId: 'state',
                    },
                  },
                ],
              },
            })
        .execute(),
    );
};

export const setOrderState = async (
  orderId: string,
  stateName: OrderState,
): Promise<ClientResponse<Order>> => {
  const order = await getOrderById(orderId);
  return await apiRoot
    .orders()
    .withId({ ID: orderId })
    .post({
      body: {
        version: order.body.version,
            actions: [
              {
                action: 'changeOrderState',
                orderState: stateName,
              },
            ],
          },
        })
    .execute();
};

export const addPaymentToCart = (cartId: string, paymentId: string): Promise<ClientResponse<Cart>> =>
  getCartById(cartId).then((cart) =>
    apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cart.body.version,
                actions: [
                  {
                    action: 'addPayment',
                            payment: {
                      typeId: 'payment',
                      id: paymentId,
                    },
                  },
                ],
              },
            })
        .execute(),
    );
