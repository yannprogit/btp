import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeamPage from "./pages/teamPage";
import AuthPage from "./pages/authPage";
import UserPage from "./pages/userPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeamPage/>} />
        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/profile" element={<UserPage/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;