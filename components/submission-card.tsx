import React from "react";
import { View, Text } from "react-native";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlumniSubmission } from "@/lib/data-service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface SubmissionCardProps {
  submission: AlumniSubmission;
  onApprove?: () => void;
  onReject?: () => void;
  onPress?: () => void;
}

export function SubmissionCard({
  submission,
  onApprove,
  onReject,
  onPress,
}: SubmissionCardProps) {
  const statusColors = {
    pending: "bg-warning",
    approved: "bg-success",
    rejected: "bg-error",
  };

  const statusLabels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <Card onPress={onPress} className="mb-4">
      <CardContent>
        {/* Header with status badge */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {submission.displayName}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {submission.email}
            </Text>
          </View>
          <View className={`${statusColors[submission.status]} rounded-full px-2 py-1`}>
            <Text className="text-xs font-semibold text-background">
              {statusLabels[submission.status]}
            </Text>
          </View>
        </View>

        {/* Department and graduation year */}
        <View className="mb-3">
          <Text className="text-sm text-muted">
            {submission.department} • Class of {submission.graduationYear}
          </Text>
        </View>

        {/* Current position */}
        {(submission.jobTitle || submission.currentCompany) && (
          <View className="bg-surface rounded-lg p-2 mb-3">
            <Text className="text-sm font-semibold text-foreground">
              {submission.jobTitle || "Position"}
            </Text>
            {submission.currentCompany && (
              <Text className="text-xs text-muted mt-1">
                at {submission.currentCompany}
              </Text>
            )}
          </View>
        )}

        {/* Bio */}
        {submission.bio && (
          <Text
            numberOfLines={2}
            className="text-sm text-foreground mb-3 leading-relaxed"
          >
            {submission.bio}
          </Text>
        )}

        {/* Submission info */}
        <View className="flex-row items-center gap-2 text-xs text-muted">
          <MaterialIcons name="person" size={14} color="#999" />
          <Text className="text-xs text-muted">
            Submitted by {submission.submittedBy === "general" ? "General User" : "Admin"}
          </Text>
        </View>

        {/* Rejection reason if applicable */}
        {submission.status === "rejected" && submission.rejectionReason && (
          <View className="mt-3 bg-error/10 rounded-lg p-2">
            <Text className="text-xs font-semibold text-error mb-1">
              Rejection Reason
            </Text>
            <Text className="text-xs text-error">
              {submission.rejectionReason}
            </Text>
          </View>
        )}
      </CardContent>

      {/* Footer with action buttons */}
      {submission.status === "pending" && (
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={onReject}
            className="flex-1"
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            onPress={onApprove}
            className="flex-1"
          >
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
