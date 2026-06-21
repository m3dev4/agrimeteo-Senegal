import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SenegalMap from "./components/map/SenegalMap";

const App = () => {
  return (
  <div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element ={<Home/>}/>
      <Route path="/carte" element={<SenegalMap />}/>
    {/*   <Route path="/alertes" element={<Alertes />} />
      <Route path="/previsions" element={<Previsions />} />
      <Route path="/historique" element={<Historique />} />
      <Route path="/rapports" element={<Rapports />} />
      <Route path="/parametres" element={<Parametres />} /> */}
    </Routes>
    </BrowserRouter>
  </div>);
};

export default App;
