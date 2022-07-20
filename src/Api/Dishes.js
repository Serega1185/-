import { instance, getConfig } from './init';

export const getDishes = () => {
    return instance.get(
        "restaurant-products/",
        getConfig(),
    );
};


export const getMenuData = () => {
    return instance.get(
        "categories/",
        getConfig(),
    );
};



// export const setAppleStorePayments = (id,data) => {
//     return instance.post(/v1/applestore_payments_user/${id}, data, getConfig());
//   };

