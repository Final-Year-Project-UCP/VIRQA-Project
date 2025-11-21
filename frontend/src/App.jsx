import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Approutes.jsx";


const App = () => {
  return (
  
      <BrowserRouter>
        < AppRoutes/>
      </BrowserRouter>
  
  );
};
export default App;
