/* eslint-disable array-callback-return */

const initTables = {
  tables: [],
};

export const tablesRestaurantReducer = (state = initTables, action) => {
  switch (action.type) {
    case "ADD_TABLES":
      return {
        ...state,
        tables: action.payload,
      };

    case "UPDATE_TABLES":
      const updateTables = state.tables.map((item) => {
        if (item.id == action.payload.id) {
          return action.payload;
        } else {
          return { ...item };
        }
      });
      return {
        ...state,
        tables: updateTables,
      };

    default:
      return state;
  }
};

export default tablesRestaurantReducer;
