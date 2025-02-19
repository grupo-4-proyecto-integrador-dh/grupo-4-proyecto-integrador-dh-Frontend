export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };
    default:
      return state;
  }
  // switch (action.type) {
  //   case "GET_USERS":
  //     return { ...state, users: action.payload };
  //   case "ADD_FAV":
  //     return { ...state, favs: [...state.favs, action.payload] };
  //   case "DELETE_FAV":
  //     const filterFavs = state.favs.filter(
  //       (fav) => fav.id !== action.payload.id
  //     );
  //     return { ...state, favs: filterFavs };
  //   case "TOGGLE_THEME":
  //     if (action.payload == "light") {
  //       document.body.classList.remove("claro");
  //       document.body.classList.add("oscuro");
  //       return {
  //         ...state,
  //         theme: "dark",
  //       };
  //     } else if (action.payload == "dark") {
  //       document.body.classList.remove("oscuro");
  //       document.body.classList.add("claro");
  //       return {
  //         ...state,
  //         theme: "light",
  //       };
  //     } else {
  //       return { ...state, theme: "light" };
  //     }
  // }
};
