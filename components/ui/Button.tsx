import React from "react";
import type { PressableProps, TextStyle } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const button = tv({
  slots: {
    container: "my-2 flex flex-row items-center justify-center rounded-md px-4",
    label: "font-inter text-base font-semibold",
    indicator: "h-6 text-white",
  },

  variants: {
    variant: {
      default: {
        container: "bg-primary dark:bg-primary",
        label: "text-white",
        indicator: "text-white dark:text-black",
      },
      secondary: {
        container: "border-gray-300 bg-gray-200",
        label: "text-gray-700",
        indicator: "text-white",
      },
      outline: {
        container: "border border-primary",
        label: "text-primary dark:text-primary",
        indicator: "text-primary dark:text-primary",
      },
      destructive: {
        container: "bg-red-600",
        label: "text-white",
        indicator: "text-white",
      },
      ghost: {
        container: "bg-transparent",
        label: "text-primary underline dark:text-white",
        indicator: "text-primary dark:text-white",
      },
      link: {
        container: "bg-transparent",
        label: "text-blue-500",
        indicator: "text-blue-500",
      },
    },
    size: {
      default: {
        container: "h-16 rounded-xl px-4",
        label: "text-base",
      },
      lg: {
        container: "h-12 px-8",
        label: "text-xl",
      },
      sm: {
        container: "h-8 px-3",
        label: "text-sm",
        indicator: "h-2",
      },
      icon: { container: "size-9" },
    },
    disabled: {
      true: {
        container: "bg-primary/60 dark:bg-primary/60",
        label: "text-gray-200 dark:text-gray-200",
        indicator: "text-gray-300 dark:text-gray-300",
      },
    },
    fullWidth: {
      true: {
        container: "",
      },
      false: {
        container: "self-center",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
    fullWidth: true,
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, "disabled"> {
  title?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  textStyle?: TextStyle | TextStyle[];
}

const Button = ({
  title,
  isLoading = false,
  variant = "default",
  disabled = false,
  size = "default",
  className = "",
  textClassName = "",
  ...props
}: Props) => {
  const styles = React.useMemo(
    () => button({ variant, disabled, size }),
    [variant, disabled, size]
  );

  // borderColor: isDefault ? "#4F46E5" : "#E5E7EB";
  return (
    <Pressable
      disabled={isLoading || disabled}
      className={styles.container({ className })}
      {...props}
    >
      {props.children ? (
        props.children
      ) : isLoading ? (
        <ActivityIndicator size="small" className={styles.indicator()} />
      ) : (
        <Text className={styles.label({ className: textClassName })}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

// const styles = StyleSheet.create({
//   button: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     borderRadius: 12,
//     elevation: 2,
//     marginTop: 8,
//     flexDirection: "row",
//   },
//   text: {
//     fontSize: 16,
//     lineHeight: 21,
//     letterSpacing: 0.25,
//   },
//   defaultText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   outlineText: {
//     color: "#4F46E5",
//     fontWeight: "500",
//   },
// });

export default Button;
