import React from "react";
import { Pressable, Text, View, ViewStyle, TextStyle } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  textClassName?: string;
}

export function Button({
  onPress,
  disabled = false,
  variant = "primary",
  size = "md",
  children,
  className,
  style,
  textClassName,
}: ButtonProps) {
  const baseClasses = "rounded-lg items-center justify-center";
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-surface border border-border",
    outline: "border border-primary",
    ghost: "bg-transparent",
  };

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textVariantClasses = {
    primary: "text-background font-semibold",
    secondary: "text-foreground font-semibold",
    outline: "text-primary font-semibold",
    ghost: "text-foreground font-semibold",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: pressed && !disabled ? 0.7 : 1,
          transform: pressed && !disabled ? [{ scale: 0.97 }] : [{ scale: 1 }],
        },
        style,
      ]}
    >
      <View
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabled && "opacity-50",
          className,
        )}
      >
        {typeof children === "string" ? (
          <Text
            className={cn(
              textVariantClasses[variant],
              textSizeClasses[size],
              textClassName,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
