import axios from "axios";

export const instance = axios.create({
  baseURL: "https://qrmenu.mysushi.dev/api/v1/",
});
////https://qrmenu.mysushi.dev/ тест
////https://qr.admin.menumysushi.ee/ боевой
export const oldInstance = axios.create({
  baseURL: "https://mere.mysushi.dev/api/v1/",
});

export const getConfig = (restaurant_id, pin_code) => {
  if (!restaurant_id) {
    console.log(localStorage.getItem("restaurant_id"));
    restaurant_id = parseInt(
      localStorage.getItem("restaurant_id").replace(/[^0-9]/g, "")
    );
    pin_code = parseInt(
      localStorage.getItem("pin_code").replace(/[^0-9]/g, "")
    );
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "restaurant-id": restaurant_id,
    "auth-code": pin_code,
  };

  return { headers };
};
