import { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";

export const useReset = (resetFuc) => {
  const location = useLocation();
  useEffect(() => {
    return resetFuc;
  }, [location.key]);
};

export const useInit = (resetFuc) => {
  const location = useLocation();
  useEffect(() => {
    resetFuc();
  }, [location.key]);
};
