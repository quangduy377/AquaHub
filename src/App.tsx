import { Navigate, Route, Routes } from "react-router-dom";
import AquariumListPage from "./features/aquariums/pages/AquariumListPage";
import LoginPage from "./features/auth/pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/aquariums" element={<AquariumListPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
