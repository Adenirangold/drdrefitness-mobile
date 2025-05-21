import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    signIn({ email, password });
  };
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="p-4  bg-gray-200 rounded-md mb-4 w-3/4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="p-4  bg-gray-200 rounded-md mb-4 w-3/4"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          disabled={loading}
          className="bg-blue-500 p-4 rounded-md w-3/4"
          onPress={handleLogin}
        >
          <Text className="text-center   font-bold">LOGIN</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default login;
