import Content from "./module/Content";
import Footer from "./module/Footer";
import Header from "./module/Header.jsx";
import { BrowserRouter } from "react-router-dom";
import { AxiosInterceptor } from "./hook/useFetch.jsx";
import { ModalProvider } from "./utils/ModalContext.jsx";

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
