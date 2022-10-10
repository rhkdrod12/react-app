import Content from "./module/Content";
import Footer from "./module/Footer";
import Header from "./module/Header.jsx";
import { BrowserRouter } from "react-router-dom";
import { ModalComponent, ModalProvider } from "./hook/useMessageModal.jsx";
import { AxiosInterceptor } from "./utils/authorization";
import React from "react";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <ModalProvider>
          <AxiosInterceptor>
            <Header />
            <Content />
            <Footer />
            <ModalComponent />
          </AxiosInterceptor>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
