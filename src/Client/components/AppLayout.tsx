import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";

export default function AppLayout() {
  const location = useLocation();

  return (
    <>
      <NavigationBar key={location.pathname} />
      <Outlet />
    </>
  );
}
