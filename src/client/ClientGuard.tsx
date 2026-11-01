import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getClientAuth } from "../data/clientStore";

export default function ClientGuard({ children }: { children: ReactNode }) {
  const auth = getClientAuth();
  if (!auth) return <Navigate to="/client/login" replace />;
  return <>{children}</>;
}
