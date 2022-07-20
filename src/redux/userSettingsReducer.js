const initialState = {
  userPin: "",
  zonaFilter: false,
  activeCatalog: false,
  userRestaurant: false,
  userProfile: false,
  userShift: false,
  userShiftId: false,
  openOrder: false,
  openOrderLast: false,
  userRestaurantId: false,
  isUpdateBd: false,
};

export const userSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_CODE":
      localStorage.setItem("pin_code", JSON.stringify(action.payload));
      return {
        ...state,
        userPin: action.payload,
      };
    case "USER_RESTAURANT_ID":
      localStorage.setItem("restaurant_id", JSON.stringify(action.payload));
      return {
        ...state,
        userRestaurantId: action.payload,
      };
    case "USER_PROFILE":
      return {
        ...state,
        userProfile: action.payload,
      };
    case "USER_SHIFT":
      const userShiftIdLocal = action.payload.id;
      return {
        ...state,
        userShift: action.payload,
        userShiftId: userShiftIdLocal,
      };
    case "USER_SHIFT_ID":
      return {
        ...state,
        userShiftId: action.payload,
      };
    case "USER_ZONA_FILTER":
      return {
        ...state,
        zonaFilter: action.payload,
      };
    case "ACTIVE_CATALOG":
      return {
        ...state,
        activeCatalog: action.payload,
      };
    case "USER_OPEN_ORDER":
      let openOrderLastLocal;
      console.log("action.payloadaction.payload", action.payload);
      let openOrderListLocal =
        action.payload && JSON.parse(JSON.stringify(action.payload.orders));
      if (openOrderListLocal.length > 0) {
        openOrderLastLocal = openOrderListLocal.sort(function (a, b) {
          return a.id > b.id ? -1 : 1;
        });
        openOrderLastLocal = openOrderListLocal[0];
      }
      return {
        ...state,
        openOrder: action.payload,
        openOrderLast: openOrderLastLocal,
      };

    case "USER_UPDATE_ONLY_ORDER":
      console.log("записали", action.payload);
      localStorage.setItem("orderPush", JSON.stringify(action.payload));
      let newOpenOrders = [];
      let openOrderLocal = JSON.parse(JSON.stringify(state.openOrder));
      let orderNew = openOrderLocal.orders.filter(
        (order) => order.id == action.payload.id
      )[0];
      if (orderNew) {
        newOpenOrders = openOrderLocal.orders.map((order) => {
          if (order.id == action.payload.id) {
            if (order.foundation) {
              if (order.foundation.id == action.payload.foundation.id) {
                return action.payload;
              }
              return { ...order };
            } else {
              return action.payload;
            }
          }
          return { ...order };
        });
        openOrderLocal.orders = newOpenOrders;
      } else {
        openOrderLocal.orders.push(action.payload);
      }

      return {
        ...state,
        openOrder: openOrderLocal,
      };

    case "UPDATE_USER_ORDER_PRODUCT":
      ///локал
      let cart = state.openOrder.orders.map((order) => {
        if (order.id === action.orderId.id) {
          let newProducts = [];
          order.products.map((product) => {
            if (product.id == action.productId.id) {
              console.log("удалить");
              if (product.foundation) {
                if (product.foundation.id == action.productId.foundation.id) {
                  return;
                }
              } else {
                return;
              }
            }
            newProducts.push(product);
          });
          return { ...order, products: newProducts };
        }
        return order;
      });
      state.openOrder.orders = cart;
      return {
        ...state,
        openOrder: state.openOrder,
        isUpdateBd: true,
      };

    case "UPDATE_USER_IS_UPDATE_BD":
      ///локал
      return {
        ...state,
        isUpdateBd: action.payload,
      };

    default:
      return state;
  }
};

export default userSettingsReducer;
