import { Text, TextInput, View } from "react-native";
import { useController, useFormContext } from "react-hook-form";

interface TextInputFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function TextInputField({
  name,
  label,
  defaultValue,
  disabled,
  placeholder,
}: TextInputFieldProps) {
  const { control } = useFormContext();

  const { field, fieldState } = useController<
    Record<string, string | undefined>
  >({
    control,
    name,
    defaultValue,
    disabled,
  });

  const { invalid, error } = fieldState;

  return (
    <View className="relative">
      <TextInput
        className={`w-full rounded-md border px-3 py-2 ${
          invalid ? "border-red-700" : "border-gray-300"
        }`}
        autoCapitalize="none"
        value={field.value}
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        placeholder={placeholder}
        secureTextEntry={name === "password"}
      />
      <Text
        className={`absolute left-2 top-[-7px] mb-[1px] bg-white px-1 text-xs ${
          invalid ? "text-red-700" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
      {invalid && (
        <Text className="mb-3 text-xs text-red-700">{error?.message}</Text>
      )}
    </View>
  );
}
