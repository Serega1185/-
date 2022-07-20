/* eslint-disable array-callback-return */

const init = {
  allCategoriesProduct: [],
  allProduct: [],
};

export const allCategoriesProduct = (state = init, action) => {
  switch (action.type) {
    case "ALL_CATEGORIES_PRODUCT":
      let listProductLocal = Array()
      action.payload.map((categor) => {
        categor.products.map((item) => {
          listProductLocal.push(item);
        });
      });
      return {
        allCategoriesProduct: action.payload,
        allProduct: listProductLocal,
      };

    // case "UPDATE_TABLES_WAITER":
    //   console.log(action.payload, action.id);
    //   const newTables = state.tables.map((item) => {
    //     if (item.id == action.id) {
    //       return { ...item, waiter_id: action.payload };
    //     } else {
    //       return { ...item };
    //     }
    //   });
    //   return {
    //     tables: newTables,
    //   };

    default:
      return state;
  }
};

export default allCategoriesProduct;
