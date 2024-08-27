import { Redirect, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Avatar from "@/components/ui/Avatar";
import DropDownMenu from "@/components/ui/DropDownMenu";
import { useSession } from "@/contexts/authProvider";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        size="large"
        color={"#4F46E5"}
      />
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <>
      <GestureHandlerRootView>
        <Pressable
          className="flex-1"
          onPress={() => {
            setIsOpen(false);
          }}
        >
          <Stack
            screenOptions={{
              headerBackTitleVisible: false,
              headerRight: () => <Avatar setIsOpen={setIsOpen} />,
            }}
          />
        </Pressable>
        {isOpen && (
          <DropDownMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isCreditOpen={isCreditOpen}
            setIsCreditOpen={setIsCreditOpen}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
}
