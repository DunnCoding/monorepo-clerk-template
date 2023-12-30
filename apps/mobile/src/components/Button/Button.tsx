import { Pressable, Text, View } from "react-native";

interface ButtonProps {
  title: string;
  onPressHandler: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  title,
  onPressHandler,
  variant,
}: ButtonProps) {
  return (
    <>
      {variant === "primary" ? (
        <View className="w-full items-center rounded bg-sky-500 py-3">
          <Pressable onPress={onPressHandler}>
            <Text className="text-white">{title}</Text>
          </Pressable>
        </View>
      ) : (
        <View className="w-full items-center rounded border border-sky-500 py-3">
          <Pressable onPress={onPressHandler}>
            <Text className="text-sky-500">{title}</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
