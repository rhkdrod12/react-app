import { createContext, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

const StableNavigateContext = createContext(null);

const StableNavigateContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  return (
    <StableNavigateContext.Provider value={navigateRef}>
      {children}
    </StableNavigateContext.Provider>
  );
};

/**
 * useNavigate
 * @returns {function(string, {state?:Object, replace?: boolean}?)}
 */
const useStableNavigate = () => {
  const navigateRef = useContext(StableNavigateContext);
  if (navigateRef.current === null)
    throw new Error("StableNavigate context is not initialized");
  return navigateRef.current;
};

export {
  StableNavigateContext,
  StableNavigateContextProvider,
  useStableNavigate,
};
