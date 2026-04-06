import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeamPage from "./pages/teamPage";
import AuthPage from "./pages/authPage";
import UserPage from "./pages/userPage";
import NotFoundPage from "./pages/notFoundPage";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TeamPage/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/profile" element={<UserPage/>}/>
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;