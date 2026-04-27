import { useSelector } from "react-redux";
import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  const authState = useSelector((s) => s.auth);
  const ctx = useAuthContext();
  return { redux: authState, context: ctx };
}
