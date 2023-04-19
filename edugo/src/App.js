import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <MainRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
