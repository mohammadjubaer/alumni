import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const roleLabel = {
    general: "General User",
    alumni: "Alumni",
    admin: "Administrator",
  };

  const statusColors = {
    active: "bg-success",
    blocked: "bg-error",
    pending: "bg-warning",
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Profile Header */}
          <View className="items-center gap-4">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
              <MaterialIcons name="person" size={48} color="#fff" />
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">
                {user?.displayName || "User"}
              </Text>
              <Text className="text-sm text-muted mt-1">
                {user?.email}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Role</Text>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="badge" size={16} color="#0a7ea4" />
                <Text className="text-sm font-semibold text-foreground">
                  {roleLabel[user?.role || "general"]}
                </Text>
              </View>
            </View>

            <View className="h-px bg-border" />

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Status</Text>
              <View className="flex-row items-center gap-2">
                <View className={`w-2 h-2 rounded-full ${statusColors[user?.status || "active"]}`} />
                <Text className="text-sm font-semibold text-foreground capitalize">
                  {user?.status || "active"}
                </Text>
              </View>
            </View>

            {user?.department && (
              <>
                <View className="h-px bg-border" />
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Department</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {user.department}
                  </Text>
                </View>
              </>
            )}

            {user?.graduationYear && (
              <>
                <View className="h-px bg-border" />
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Graduation Year</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {user.graduationYear}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Quick Actions
            </Text>
            <Button
              variant="secondary"
              size="md"
              onPress={() => console.log("Edit profile")}
            >
              Edit Profile
            </Button>
            {user?.role === "general" && (
              <Button
                variant="secondary"
                size="md"
                onPress={() => console.log("Submit alumni info")}
              >
                Submit Alumni Information
              </Button>
            )}
            {user?.role === "alumni" && (
              <Button
                variant="secondary"
                size="md"
                onPress={() => console.log("Create post")}
              >
                Create Post
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                variant="secondary"
                size="md"
                onPress={() => console.log("Go to admin panel")}
              >
                Admin Dashboard
              </Button>
            )}
          </View>

          {/* Account Settings */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Account
            </Text>
            <Pressable
              className="flex-row items-center justify-between bg-surface rounded-lg p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="notifications" size={20} color="#0a7ea4" />
                <Text className="text-sm font-medium text-foreground">
                  Notifications
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#666" />
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between bg-surface rounded-lg p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="privacy-tip" size={20} color="#0a7ea4" />
                <Text className="text-sm font-medium text-foreground">
                  Privacy & Security
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#666" />
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between bg-surface rounded-lg p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="help" size={20} color="#0a7ea4" />
                <Text className="text-sm font-medium text-foreground">
                  Help & Support
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#666" />
            </Pressable>
          </View>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="lg"
            onPress={handleLogout}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
