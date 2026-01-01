import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  inputClassName,
  ...props
}: InputProps) {
  const colors = useColors();

  return (
    <View className={cn("mb-4", containerClassName)}>
      {label && (
        <Text className="text-sm font-semibold text-foreground mb-2">
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        className={cn(
          "bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base",
          error && "border-error",
          inputClassName,
        )}
        style={{
          color: colors.foreground,
        }}
      />
      {error && (
        <Text className="text-xs text-error mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
