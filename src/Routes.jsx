import React, { Fragment, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthRoutes } from "./utils/authorization.jsx";
import Login from "./pages/user/login.jsx";
import Join from "./pages/user/join.jsx";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "./module/BasicComp/Loading.jsx";
import { StableNavigateContextProvider } from "./module/BasicComp/StableNavigateContext";
import { FadeDiv } from "./module/BasicComp/Fade";

const AUTH_COMPONENTS = import.meta.glob(
  [
    `/src/pages/**/[a-zA-Z]+.jsx`,
    "!/src/pages/user/**",
    "!/src/pages/(_app|main|404).jsx",
  ],
  {
    eager: true,
  }
);
const BASIC = import.meta.glob(`/src/pages/(_app|main|404).jsx`, {
  eager: true,
});

// vite의 기능으로서 모듈들을 정규식에 맞는 여러 모듈들을 동시에 Import할 수 있음
// 해당 모듈들은 동적으로 지연 불러오기로 작동함

/**
 * vite에 의해 동적으로 가져와진 page경로 내에 있는 기본 페이지와 404페이지를 가져와
 * 경로와 컴포넌트를 호출
 */
const basics = Object.keys(BASIC).reduce((basic, file) => {
  const key = file.replace(/\/src\/pages\/|\.jsx$/g, "");
  return { ...basic, [key]: BASIC[file].default };
}, {});

/**
 * vite에 의해 동적으로 가져와진 page경로 내에 있는 모든 컴포넌트들을 경로와 컴포넌트를 호출
 */
const auth_components = Object.keys(AUTH_COMPONENTS).map((component) => {
  const path = component
    .replace(/\/src\/pages|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");
  return { path, component: AUTH_COMPONENTS[component].default };
});

const PathRoutes = () => {
  const App = basics?.["_app"] || Fragment;
  const NotFound = basics?.["404"] || Fragment;
  const Main = basics?.["main"] || NotFound;

  console.log(auth_components);

  return (
    <App>
      <StableNavigateContextProvider>
        <TransitionRouters>
          {auth_components.map(
            ({ path, component: Component = Fragment }, idx) => (
              <Route
                key={path}
                path={path}
                element={
                  <AuthRoutes path={path}>
                    <Component />
                  </AuthRoutes>
                }
              />
            )
          )}
          <Route path="/" element={<Main />} />
          <Route path={"/user/*"}>
            <Route path="login" element={<Login />} />
            <Route path="join" element={<Join />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </TransitionRouters>
      </StableNavigateContextProvider>
    </App>
  );
};

const TransitionRouters = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode={"wait"}>
      <FadeDiv className={"main-frame-wapper wh100"} key={location.key}>
        <Routes location={location}>{children}</Routes>
      </FadeDiv>
    </AnimatePresence>
  );
};

export default PathRoutes;
