import { Navigate, Route, Routes } from "react-router-dom";
import AquariumListPage from "./features/aquariums/pages/AquariumListPage";
import LoginPage from "./features/auth/pages/LoginPage";
import { ROUTES } from "./routes/AquaRoutes";
function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AQUARIUMS} element={<AquariumListPage />} />
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default App
