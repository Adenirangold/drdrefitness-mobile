import { getUser } from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
interface LoginProps {
  email: string;
  password: string;
}
interface IAuthContext {
  isAuthenticated: boolean;
  loading: boolean;

  signIn: ({ email, password }: LoginProps) => Promise<void>;
  signOut: () => Promise<void>;
  user: UserData | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync("authToken");

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const result = await getUser(token);
        if (!result) {
          throw new Error("Failed to fetch user data.");
        }

        const { data, error } = result;

        if (error || !data) {
          throw new Error("Invalid user data.");
        }

        setUser(data.data);
        await SecureStore.setItemAsync("userData", JSON.stringify(data));

        setIsAuthenticated(true);

        router.replace("/home");
      } catch (error: any) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUser(null);
        if (error.message.includes("Invalid token")) {
          Alert.alert("Session Expired", "Please log in again.");
          router.replace("/login");
        }
        Alert.alert("Something happened", "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const signIn = async (data: LoginProps) => {
    setLoading(true);
    //  http://172.20.10.3:3000  http://localhost:3000 http://192.168.18.9:3000 192.168.18.5
    try {
      const response = await fetch("http://192.168.18.5:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        if (errorData && errorData.message) {
          console.log("jj");

          Alert.alert("Login failed", errorData.message);
          return;
        }
      }

      const responseData = await response.json();
      const token = responseData.data?.token;
      if (!token) {
        throw new Error("No token received from server.");
      }

      await SecureStore.setItemAsync("authToken", token);

      setIsAuthenticated(true);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login failed", "An unknown error occurred");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/login");
  };

  const value: IAuthContext = {
    isAuthenticated,
    loading,
    signIn,
    signOut,
    user,
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
