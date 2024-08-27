import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <View className="items-center justify-center py-20">
          <ThemedText type="title">This screen doesn't exist.</ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
