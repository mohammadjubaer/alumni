import React from "react";
import { View, Text, Pressable } from "react-native";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AlumniCardProps {
  id: string;
  name: string;
  department: string;
  graduationYear: number;
  jobTitle?: string;
  company?: string;
  verified?: boolean;
  onPress?: () => void;
  onContact?: () => void;
}

export function AlumniCard({
  id,
  name,
  department,
  graduationYear,
  jobTitle,
  company,
  verified = true,
  onPress,
  onContact,
}: AlumniCardProps) {
  return (
    <Card onPress={onPress} className="mb-4">
      <CardContent>
        {/* Header with name and verified badge */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-foreground">
                {name}
              </Text>
              {verified && (
                <View className="bg-success rounded-full p-1">
                  <MaterialIcons name="check" size={12} color="#fff" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Department and graduation year */}
        <View className="mb-2">
          <Text className="text-sm text-muted font-medium">
            {department}
          </Text>
          <Text className="text-xs text-muted">
            Class of {graduationYear}
          </Text>
        </View>

        {/* Job title and company */}
        {(jobTitle || company) && (
          <View className="bg-surface rounded-lg p-2 mb-3">
            <Text className="text-sm font-semibold text-foreground">
              {jobTitle || "Position"}
            </Text>
            {company && (
              <Text className="text-xs text-muted mt-1">
                at {company}
              </Text>
            )}
          </View>
        )}

        {/* Bio or placeholder */}
        <Text className="text-sm text-muted leading-relaxed">
          Experienced professional in {department} field
        </Text>
      </CardContent>

      {/* Footer with action button */}
      <CardFooter className="justify-end">
        <Button
          variant="primary"
          size="sm"
          onPress={onContact}
        >
          Request Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
