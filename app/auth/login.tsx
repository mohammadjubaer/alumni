import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      await login(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="p-6 justify-center">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Welcome Back
            </Text>
            <Text className="text-base text-muted text-center">
              Sign in to your IIUC Alumni account
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSubmitting}
            />

            {error && (
              <View className="bg-error/10 rounded-lg p-3">
                <Text className="text-sm text-error">{error}</Text>
              </View>
            )}

            <Button
              onPress={handleLogin}
              disabled={isSubmitting || isLoading}
              size="lg"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </View>

          {/* Divider */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-sm text-muted">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Sign Up Link */}
          <View className="items-center gap-2">
            <Text className="text-sm text-muted">
              Don't have an account?
            </Text>
            <Button
              variant="outline"
              size="lg"
              onPress={() => router.push("../auth/signup")}
              disabled={isSubmitting}
            >
              Create Account
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
