import { Navigate, Route, Routes } from "react-router-dom";
import AquariumListPage from "./features/aquariums/pages/AquariumListPage";
import LoginPage from "./features/auth/pages/LoginPage";
import AquariumWaterQualityPage from "./features/aquariums/pages/AquariumWaterQualityPage";
import { ROUTES } from "./routes/AquaRoutes";
import AppLayout from "./components/AppLayout";
import ShrimpsPage from "./features/shrimps/pages/ShrimpsPage";
import ShrimpDetailPage from "./features/shrimps/pages/ShrimpDetailPage";
function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path={ROUTES.TESTING_SHRIMPS} element={<ShrimpsPage />} />
        <Route path={ROUTES.SHRIMP_DETAIL} element={<ShrimpDetailPage />} />
        <Route path={ROUTES.AQUARIUMS} element={<AquariumListPage />} />
        <Route path={ROUTES.AQUARIUM_WATER_QUALITY} element={<AquariumWaterQualityPage />} />
      </Route>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default App
