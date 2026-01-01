import React from "react";
import { View, Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, onPress, className, elevated = true }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed && onPress ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          "bg-surface rounded-xl p-4 border border-border",
          elevated && "shadow-sm",
          className,
        )}
      >
        {children}
      </View>
    </Pressable>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function CardHeader({ title, subtitle, className }: CardHeaderProps) {
  return (
    <View className={cn("mb-2", className)}>
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
      {subtitle && <Text className="text-sm text-muted mt-1">{subtitle}</Text>}
    </View>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <View className={cn("", className)}>{children}</View>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <View className={cn("mt-4 pt-4 border-t border-border flex-row justify-between", className)}>{children}</View>;
}
