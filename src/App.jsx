import Content from "./module/Content";
import Footer from "./module/Footer";
import Header from "./module/Header.jsx";
import { BrowserRouter } from "react-router-dom";
import { ModalComponent, ModalProvider } from "./hook/useMessageModal.jsx";
import { AxiosInterceptor } from "./utils/authorization";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // window focus 설정
    },
  },
});

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <ModalProvider>
          <AxiosInterceptor>
            <QueryClientProvider client={queryClient}>
              <Header />
              <Content />
              <Footer />
            </QueryClientProvider>
            <ModalComponent />
          </AxiosInterceptor>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
