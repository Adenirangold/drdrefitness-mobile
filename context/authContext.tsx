import api from "@/lib/api";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface LoginProps {
  email: string;
  password: string;
}
interface IAuthContext {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: ({ email, password }: LoginProps) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          setIsAuthenticated(true);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          router.replace("/home");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const signIn = async ({ email, password }: LoginProps) => {
    try {
      const response = await api.get("/endpoint");
      console.log(response.data);
      const token = "hhh";
      await SecureStore.setItemAsync("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);

      router.replace("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("authToken");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  const value: IAuthContext = {
    isAuthenticated,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
