import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyleDiv } from "../module/StyleComp/StyleComp.jsx";
import styled from "styled-components";
import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import { authorization, formFetch, postFetch } from "../hook/useFetch.jsx";
import axios from "axios";
const main = () => {
  const navi = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    navi(event.target.dataset["path"], { state: { val: 1 } });
  };
  return <div>메인입니다.</div>;
};

export default main;
