import Content from "./module/Content";
import Footer from "./module/Footer";
import Header from "./module/Header.jsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Header />
        <Content />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
