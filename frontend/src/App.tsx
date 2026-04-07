import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeamPage from "./pages/teamPage";
import AuthPage from "./pages/authPage";
import UserPage from "./pages/userPage";
import NotFoundPage from "./pages/notFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TeamPage/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/profile" element={<UserPage/>}/>
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;