import { createContext, useContext,  useReducer } from "react";
import { reducer } from "../Reducers/reducer";

const UserStates = createContext();

const initialState = {};
// eslint-disable-next-line react/prop-types
const Context = ({ children }) => {
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
    <UserStates.Provider value={{ state, dispatch }}>
      {children}
    </UserStates.Provider>
  );
};
export default Context;

// eslint-disable-next-line react-refresh/only-export-components
export const useUserStates = () => useContext(UserStates);
