import { Navigate, Route, Routes } from "react-router-dom";
import AquariumListPage from "./Client/features/aquariums/pages/AquariumListPage";
import LoginPage from "./Client/features/auth/pages/LoginPage";
import { ROUTES } from "./Client/routes/AquaRoutes";
function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AQUARIUMS} element={<AquariumListPage />} />
      <Route path={ROUTES.HOME} element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
