import styled from "styled-components";
import React, { useCallback, useRef, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { StyleDiv } from "../StyleComp/StyleComp.jsx";

import "../../css/Module/DepthMenu.css";
import { useNavigate } from "react-router-dom";
import { useGetFetch } from "../../hook/useFetch.jsx";
import { getRect } from "../../utils/commonUtils.js";

const HeaderMenu = () => {
  const [menus] = useGetFetch("/menu/get2", {
    param: { menuType: "MT001" },
  });

  return (
    <div className="menu-container">
      <DepthMenu menuList={menus} upperMenu={1} depth={1} />
    </div>
  );
};

const DepthMenu = ({ menuList, depth = 0, upperMenu, height = 40 }) => {
  return (
    <MenuContainer inStyle={{ height }}>
      {menuList
        ? menuList
            .filter(
              (item) => item.upperMenu === upperMenu && item.menuDepth === depth
            )
            .map((item, idx) => {
              return (
                <MenuButton
                  key={idx}
                  data={item}
                  menuList={menuList}
                  depth={depth}
                >
                  <MainMenuBtn data={item} height={height} />
                </MenuButton>
              );
            })
        : null}
    </MenuContainer>
  );
};

const MenuContainer = styled(StyleDiv)`
  display: inline-flex;
  position: relative;
`;

const MainMenuBtn = ({ data, isOpen, height = 40 }) => {
  return (
    <StyleDiv
      inStyle={{ height }}
      className={`main-menu-container ${isOpen ? "main-menu-over" : ""}`}
    >
      <div className={`main-menu-name`}>{data.name}</div>
      <div className={`main-menu-bar`} />
    </StyleDiv>
  );
};

const MenuButton = ({ children, data, menuList, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenuList = menuList.filter((item) => item.upperMenu == data.menuId);
  const subMenu = subMenuList && subMenuList.length > 0;
  const navi = useNavigate();

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      navi(data.url);
    },
    [isOpen]
  );
  const onMouseOver = useCallback(
    (event) => !isOpen && setIsOpen(true),
    [isOpen]
  );
  const onMouseLeave = useCallback(
    (event) => isOpen && setIsOpen(false),
    [isOpen]
  );

  /**
  /**
   * Depth별 위치 방향 설정, 2인경우에는 부모의 왼쪽의 아래에 표기하도록 함
   * 나머지는 default direction: ["right", "top"]
   * @type {{"2": string[]}}
   */
  const depthDirection = {
    2: ["left", "bottom"],
  };

  return (
    <React.Fragment>
      <div
        ref={ref}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        className="menu-content main-menu"
      >
        {/* 자식에게 props 추가하여 전달! */}
        {React.cloneElement(children, { isOpen })}
        {isOpen && subMenu ? (
          <SubMenuContent
            childMenuList={subMenuList}
            menuList={menuList}
            upperRef={ref}
            depth={depth + 1}
            depthDirection={depthDirection}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

/*********************************************************************************************************************************/
const SubMenuContent = ({
  childMenuList,
  menuList,
  upperRef,
  minWidth,
  depth = 0,
  depthDirection = {},
}) => {
  const direction = depthDirection[depth]
    ? depthDirection[depth]
    : ["right", "top"];
  const { top, left, width } = getRect(upperRef, ...direction, { offsetY: 1 });
  return (
    <StyleDiv
      inStyle={{ top, left, minWidth: minWidth || width }}
      className={"sub-side-menu-container"}
    >
      {childMenuList
        .filter((menu) => menu.menuDepth == depth)
        .map((menu, menuIdx) => {
          return (
            <SubMenuButton
              key={menuIdx}
              data={menu}
              menuList={menuList}
              depth={depth}
              depthDirection={depthDirection}
            />
          );
        })}
    </StyleDiv>
  );
};

const SubMenuButton = ({ data, menuList, depth, minWidth, depthDirection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const subMenuList = menuList.filter((item) => item.upperMenu == data.menuId);
  const subMenu = subMenuList && subMenuList.length > 0;

  const navi = useNavigate();
  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      console.log(data.url + " 이동 ");
      console.log(ref);
      navi(data.url);
    },
    [isOpen]
  );
  const onMouseOver = useCallback(
    (event) => !isOpen && setIsOpen((val) => !val),
    [isOpen]
  );
  const onMouseLeave = useCallback(
    (event) => isOpen && setIsOpen(false),
    [isOpen]
  );

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={`menu-content`}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <div className={`menu-name sub-menu-name ${isOpen ? "menu-over" : ""}`}>
          <div>{data.name}</div>
          <ChevronRightIcon
            fontSize="small"
            color="disabled"
            sx={{ opacity: `${subMenu ? 1 : 0}` }}
          />
        </div>
        {isOpen && subMenu ? (
          <SubMenuContent
            childMenuList={subMenuList}
            menuList={menuList}
            upperRef={ref}
            minWidth={minWidth}
            depth={depth + 1}
            depthDirection={depthDirection}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default HeaderMenu;
/*********************************************************************************************************************************/
