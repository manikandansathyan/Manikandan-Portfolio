import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Preloader from "./components/preloader/Preloader";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading && (
        <Preloader onComplete={() => setLoading(false)} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;