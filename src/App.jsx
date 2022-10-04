import Content from "./module/Content";
import Footer from "./module/Footer";
import Header from "./module/Header.jsx";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./utils/ModalContext.jsx";
import { AxiosInterceptor } from "./utils/authorization";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <ModalProvider>
          <AxiosInterceptor>
            <Header />
            <Content />
            <Footer />
          </AxiosInterceptor>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
