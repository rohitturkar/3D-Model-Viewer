import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Editor from "./Pages/Editor/Editor";

function App() {
  const [modelLink, setModelLink] = useState("");
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home modellink={modelLink} setModelLink={setModelLink} />}
        />
        <Route path="/editor" element={<Editor modelLink={modelLink} />} />
      </Routes>
    </>
  );
}

export default App;
