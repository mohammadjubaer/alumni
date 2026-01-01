import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dataService, AlumniSubmission, Report } from "@/lib/data-service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export default function AdminDashboardScreen() {
  const colors = useColors();
  const [pendingSubmissions, setPendingSubmissions] = useState<AlumniSubmission[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlumni: 0,
    totalPosts: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const submissions = await dataService.getSubmissions("pending");
      const reports = await dataService.getReports("pending");
      const posts = await dataService.getPosts();

      setPendingSubmissions(submissions);
      setPendingReports(reports);
      setStats({
        totalUsers: 150, // Mock data
        totalAlumni: 45,
        totalPosts: posts.length,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <Card className="flex-1">
      <CardContent className="items-center gap-2">
        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
          <MaterialIcons name={icon as any} size={24} color={colors.primary} />
        </View>
        <Text className="text-2xl font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted text-center">{label}</Text>
      </CardContent>
    </Card>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </Text>
            <Text className="text-sm text-muted mt-1">
              Manage alumni and moderate content
            </Text>
          </View>

          {/* Stats */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Overview
            </Text>
            <View className="flex-row gap-3">
              <StatCard icon="people" label="Total Users" value={stats.totalUsers} />
              <StatCard icon="verified-user" label="Alumni" value={stats.totalAlumni} />
              <StatCard icon="article" label="Posts" value={stats.totalPosts} />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Quick Actions
            </Text>
            <Button
              variant="secondary"
              size="md"
              onPress={() => console.log("View pending submissions")}
            >
              Review Submissions ({pendingSubmissions.length})
            </Button>
            <Button
              variant="secondary"
              size="md"
              onPress={() => console.log("View reports")}
            >
              Review Reports ({pendingReports.length})
            </Button>
            <Button
              variant="secondary"
              size="md"
              onPress={() => console.log("Manage users")}
            >
              Manage Users
            </Button>
          </View>

          {/* Pending Submissions */}
          {pendingSubmissions.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">
                  Pending Submissions
                </Text>
                <View className="bg-warning rounded-full px-2 py-1">
                  <Text className="text-xs font-bold text-background">
                    {pendingSubmissions.length}
                  </Text>
                </View>
              </View>

              {pendingSubmissions.slice(0, 3).map((submission) => (
                <Card key={submission.id}>
                  <CardContent>
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                          {submission.displayName}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {submission.department} • Class of {submission.graduationYear}
                        </Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.6 : 1,
                          },
                        ]}
                      >
                        <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                      </Pressable>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}

          {/* Pending Reports */}
          {pendingReports.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">
                  Pending Reports
                </Text>
                <View className="bg-error rounded-full px-2 py-1">
                  <Text className="text-xs font-bold text-background">
                    {pendingReports.length}
                  </Text>
                </View>
              </View>

              {pendingReports.slice(0, 3).map((report) => (
                <Card key={report.id}>
                  <CardContent>
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                          {report.reason}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          Reported by: {report.reportedBy}
                        </Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.6 : 1,
                          },
                        ]}
                      >
                        <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                      </Pressable>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}

          {/* Admin Settings */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Admin Settings
            </Text>
            <Pressable
              className="flex-row items-center justify-between bg-surface rounded-lg p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="security" size={20} color={colors.primary} />
                <Text className="text-sm font-medium text-foreground">
                  Security Settings
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#666" />
            </Pressable>

            <Pressable
              className="flex-row items-center justify-between bg-surface rounded-lg p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="analytics" size={20} color={colors.primary} />
                <Text className="text-sm font-medium text-foreground">
                  Analytics
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#666" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
