import { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";

const useReset = (resetFuc) => {
  const location = useLocation();
  console.log("useEffect1 동작 %o", location);
  useEffect(() => {
    console.log("useEffect2 동작");
    return resetFuc;
  }, [location.key]);
};

export default useReset;
