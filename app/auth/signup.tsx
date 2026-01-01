import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      if (!email || !password || !confirmPassword || !displayName) {
        setError("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      await signUp(email, password, displayName);
      router.replace("/(tabs)");
    } catch (err) {
      setError("Sign up failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Join IIUC Alumni
            </Text>
            <Text className="text-base text-muted text-center">
              Create your account to connect with alumni
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={displayName}
              onChangeText={setDisplayName}
              editable={!isSubmitting}
            />

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

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isSubmitting}
            />

            {error && (
              <View className="bg-error/10 rounded-lg p-3">
                <Text className="text-sm text-error">{error}</Text>
              </View>
            )}

            <Button
              onPress={handleSignUp}
              disabled={isSubmitting || isLoading}
              size="lg"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </View>

          {/* Login Link */}
          <View className="items-center gap-2">
            <Text className="text-sm text-muted">
              Already have an account?
            </Text>
            <Button
              variant="outline"
              size="lg"
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </View>

          {/* Terms */}
          <Text className="text-xs text-muted text-center leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
