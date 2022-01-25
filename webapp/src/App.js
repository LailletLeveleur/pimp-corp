import './App.css';
import Mint from "./Mint/Mint";
import PimpList from "./PimpList/PimpList";
import { useState } from "react";


function App() {
  const [userNFTs, setUserNFTs] = useState("");

  return (
    <div className="App">
      <Mint setUserNFTs={setUserNFTs} />
      <PimpList userNFTs={userNFTs} />
    </div>
  );
}

export default App