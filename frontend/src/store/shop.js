import { addItem } from "./session";

// constants
const LOAD_SHOP_ITEMS = "shop/LOAD_SHOP_ITEMS";

// actions
const loadShopItems = (items) => ({
  type: LOAD_SHOP_ITEMS,
  items,
});

// thunks
export const getShopItems = () => async (dispatch) => {
  const res = await fetch(`/api/items/`);
  const { items } = await res.json();

  if (res.ok) {
    const normalizedData = {};
    items.forEach((item) => (normalizedData[item.id] = item));
    dispatch(loadShopItems(normalizedData));
    return normalizedData;
  }
};

export const buyItem = (itemId) => async (dispatch) => {
  const res = await fetch(`/api/items/${itemId}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const item = await res.json();
    dispatch(addItem(item));
    return item;
  }
};

// reducer
const shopReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SHOP_ITEMS:
      return { ...action.items };
    default:
      return state;
  }
};

export default shopReducer;
