import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "../Reducers/reducer";

const ProductState = createContext();

const initialState = { products: [] };
export const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const url = "https://jsonplaceholder.typicode.com/users";

  // useEffect(() => {
  //   localStorage.setItem("favs", JSON.stringify(state.favs));
  // }, [state.favs]);

  // useEffect(() => {
  //   axios(url)
  //     .then((res) => {
  //       dispatch({ type: "GET_USERS", payload: res.data });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <ProductState.Provider value={{ state, dispatch }}>
      {children}
    </ProductState.Provider>
  );
};

export const useProductState = () => useContext(ProductState);
