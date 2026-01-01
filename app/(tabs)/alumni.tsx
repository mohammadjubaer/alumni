import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AlumniCard } from "@/components/alumni-card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

// Mock alumni data
const mockAlumni = [
  {
    id: "1",
    name: "Dr. Ahmed Hassan",
    department: "Computer Science",
    graduationYear: 2015,
    jobTitle: "Senior Software Engineer",
    company: "Google",
    verified: true,
  },
  {
    id: "2",
    name: "Fatima Khan",
    department: "Business Administration",
    graduationYear: 2018,
    jobTitle: "Product Manager",
    company: "Microsoft",
    verified: true,
  },
  {
    id: "3",
    name: "Mohammad Ali",
    department: "Electrical Engineering",
    graduationYear: 2016,
    jobTitle: "Lead Engineer",
    company: "Tesla",
    verified: true,
  },
  {
    id: "4",
    name: "Aisha Rahman",
    department: "Medicine",
    graduationYear: 2019,
    jobTitle: "Resident Doctor",
    company: "Johns Hopkins Hospital",
    verified: true,
  },
  {
    id: "5",
    name: "Hassan Ibrahim",
    department: "Computer Science",
    graduationYear: 2020,
    jobTitle: "Junior Developer",
    company: "Startup XYZ",
    verified: false,
  },
];

export default function AlumniScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlumni, setFilteredAlumni] = useState(mockAlumni);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const departments = Array.from(new Set(mockAlumni.map((a) => a.department)));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterAlumni(query, selectedDepartment);
  };

  const handleDepartmentFilter = (dept: string | null) => {
    setSelectedDepartment(dept);
    filterAlumni(searchQuery, dept);
  };

  const filterAlumni = (query: string, dept: string | null) => {
    let filtered = mockAlumni;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.company.toLowerCase().includes(lowerQuery) ||
          a.jobTitle.toLowerCase().includes(lowerQuery),
      );
    }

    if (dept) {
      filtered = filtered.filter((a) => a.department === dept);
    }

    setFilteredAlumni(filtered);
  };

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={filteredAlumni}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlumniCard
            {...item}
            onContact={() => console.log("Contact request for", item.name)}
          />
        )}
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-2">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-foreground">
                Alumni Directory
              </Text>
              <Text className="text-sm text-muted mt-1">
                Connect with verified alumni
              </Text>
            </View>

            {/* Search Bar */}
            <View className="mb-4">
              <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
                <MaterialIcons name="search" size={20} color={colors.muted} />
                <TextInput
                  placeholder="Search alumni..."
                  placeholderTextColor={colors.muted}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  className="flex-1 ml-2 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>
            </View>

            {/* Department Filter */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Filter by Department
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-2"
              >
                <Pressable
                  onPress={() => handleDepartmentFilter(null)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View
                    className={`px-4 py-2 rounded-full ${
                      selectedDepartment === null
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selectedDepartment === null
                          ? "text-background"
                          : "text-foreground"
                      }`}
                    >
                      All
                    </Text>
                  </View>
                </Pressable>

                {departments.map((dept) => (
                  <Pressable
                    key={dept}
                    onPress={() => handleDepartmentFilter(dept)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View
                      className={`px-4 py-2 rounded-full ${
                        selectedDepartment === dept
                          ? "bg-primary"
                          : "bg-surface border border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          selectedDepartment === dept
                            ? "text-background"
                            : "text-foreground"
                        }`}
                      >
                        {dept}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Results count */}
            <Text className="text-xs text-muted mb-4">
              {filteredAlumni.length} alumni found
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="px-4 py-12 items-center">
            <MaterialIcons name="people-outline" size={48} color={colors.muted} />
            <Text className="text-lg font-semibold text-foreground mt-4">
              No alumni found
            </Text>
            <Text className="text-sm text-muted text-center mt-2">
              Try adjusting your search or filter criteria
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}
