import React from "react";
import { useQuery } from "react-query";
import { getFetch } from "../../hook/useFetch.jsx";

const MENU_KEY = "getMenu";
const getMenu = () => getFetch("/menu/get2", { menuType: "MT001" });

const Test = () => {
  const menuQuery = useQuery(MENU_KEY, getMenu, {
    // refetchOnWindowFocus: true,
    staleTime: Infinity, // 5초
    cacheTime: 0, // 제한 없음
  });

  console.log(`render %o`, menuQuery);

  if (menuQuery.isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {menuQuery.data?.map((data, idx) => (
          <div key={idx}>{data.name}</div>
        ))}
      </div>
    );
  }
};

export default Test;
