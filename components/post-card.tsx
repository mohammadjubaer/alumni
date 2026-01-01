import React from "react";
import { View, Text, Pressable } from "react-native";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Post } from "@/lib/data-service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onSave?: () => void;
}

export function PostCard({ post, onPress, onLike, onSave }: PostCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const postTypeLabel = post.type === "job" ? "Job Opportunity" : "Advice";
  const postTypeColor = post.type === "job" ? "bg-primary" : "bg-warning";

  return (
    <Card onPress={onPress} className="mb-4">
      <CardContent>
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-sm text-muted font-medium">
              {post.authorName}
            </Text>
            {post.authorDepartment && (
              <Text className="text-xs text-muted">
                {post.authorDepartment}
              </Text>
            )}
          </View>
          <View className={cn(postTypeColor, "rounded-full px-2 py-1")}>
            <Text className="text-xs font-semibold text-background">
              {postTypeLabel}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-foreground mb-2">
          {post.title}
        </Text>

        {/* Company/Category for jobs */}
        {post.type === "job" && post.company && (
          <Text className="text-sm text-muted mb-2">
            {post.company} • {post.position}
          </Text>
        )}

        {/* Content preview */}
        <Text
          numberOfLines={3}
          className="text-sm text-foreground mb-3 leading-relaxed"
        >
          {post.content}
        </Text>

        {/* Tags */}
        {post.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <View key={index} className="bg-surface rounded-full px-2 py-1">
                <Text className="text-xs text-muted">#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Metadata */}
        <Text className="text-xs text-muted mb-3">
          {formatDate(post.createdAt)}
        </Text>
      </CardContent>

      {/* Footer with actions */}
      <CardFooter className="gap-4">
        <Pressable
          onPress={onLike}
          className="flex-row items-center gap-1"
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="favorite-border" size={18} color="#666" />
          <Text className="text-xs text-muted">{post.likes}</Text>
        </Pressable>

        <Pressable
          onPress={onSave}
          className="flex-row items-center gap-1"
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="bookmark-border" size={18} color="#666" />
          <Text className="text-xs text-muted">{post.saves}</Text>
        </Pressable>

        <Pressable
          className="flex-row items-center gap-1 ml-auto"
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="share" size={18} color="#666" />
          <Text className="text-xs text-muted">Share</Text>
        </Pressable>
      </CardFooter>
    </Card>
  );
}

// Helper function - import from utils
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
