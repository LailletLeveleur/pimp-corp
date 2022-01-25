import './App.css';
import Mint from "./Mint/Mint";
import { useEffect, useState } from "react";


function App() {
  const [userNFTs, setUserNFTs] = useState("");

  return (
    <div className="App">
      <Mint setUserNFTs={setUserNFTs} />
    </div>
  );
}

export default App