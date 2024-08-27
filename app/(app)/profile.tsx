/* eslint-disable max-lines-per-function */
import { SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

import { queryClient } from "@/api/apiProvider";
import { useOrgById, useUpdateOrg, useUpdateOrgLogo } from "@/api/useOrg";
import { useUpdateAvatar, useUpdateUser } from "@/api/useUser";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/authProvider";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";
import { getPrimaryOrg } from "@/libs/utils";

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default function Profile() {
  const { session, signIn: updateSession, signOut, isLoading } = useSession();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const orgId = getPrimaryOrg(session?.roles)?.id;

  const { mutateAsync: updateOrgLogo } = useUpdateOrgLogo();
  const { mutateAsync: updateUser, isPending: isUserUpdating } =
    useUpdateUser();
  const { mutateAsync: updateOrg, isPending: isOrgUpdating } = useUpdateOrg();
  const { mutateAsync: updateAvatar } = useUpdateAvatar();

  const { data: orgDetail } = useOrgById({
    variables: { orgId: orgId as string },
    enabled: !!orgId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      oldPassword: "",
      newPassword: "",
      organisationName: "",
    },
  });

  useEffect(() => {
    if (session) {
      reset({
        firstName: session?.firstName,
        lastName: session?.lastName,
        newPassword: "",
        oldPassword: "",
        organisationName: orgDetail?.name || "",
      });
    }
    //@ts-ignore
  }, [session, orgDetail]);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const organisationNameRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);

  const onChangeProfileAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    try {
      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        updateAvatar(
          {
            id: session?.id ?? "",
            avatarBase64: base64Image,
          },
          {
            onSuccess: async (data) => {
              Toast.show("User avatar updated.", SuccessMessageStyle);
              //@ts-ignore
              updateSession({ ...session, avatar: data });
              // queryClient.invalidateQueries({ queryKey: ["orgById"] });
            },
            onError(error) {
              console.log(error);
            },
          }
        );
      }
    } catch {
      Toast.show("Failed to change Avatar logo", ErrorMessageStyle);
    }
  };

  const onChangeOrgLogo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    try {
      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        updateOrgLogo(
          {
            orgId: session?.roles[0].id ?? "",
            logoBase64: base64Image,
          },
          {
            onSuccess(updatedLogo) {
              queryClient.invalidateQueries({ queryKey: ["orgById"] });
              Toast.show("Org logo updated", SuccessMessageStyle);
            },
          }
        );
      }
    } catch {
      Toast.show("Failed to change org logo", ErrorMessageStyle);
    }
  };

  async function handleLogOut() {
    signOut();
    router.push("/login");
  }

  const navigation = useNavigation();
  navigation.setOptions({
    title: "Profile",
    // eslint-disable-next-line react/no-unstable-nested-components
    headerRight: () => (
      <Text
        className="mt-r-4 text-base font-medium text-red-500"
        onPress={handleLogOut}
      >
        Log out
      </Text>
    ),
  });

  const onSubmit = async (data: any) => {
    const { firstName, lastName, newPassword, organisationName, oldPassword } =
      data;
    try {
      setSubmitting(true);
      if (session?.id) {
        return updateUser(
          {
            id: session.id,
            firstName,
            lastName,
            newPassword,
            oldPassword,
            organisationName,
          },
          {
            onSuccess: async (data) => {
              updateSession({ ...session, firstName, lastName });
              const orgId = session.roles[0].id;
              if (orgId) {
                updateOrg({
                  id: session.id,
                  orgId: orgId,
                  name: organisationName || "",
                });
              }
            },
          }
        ).then(() => {
          Toast.show(
            "Profile and Organization updated successfully.",
            SuccessMessageStyle
          );
          router.push("/");
        });
      }
    } catch (error: any) {
      console.log(error.message);
      Toast.show(
        "Something Went wrong please try again later",
        ErrorMessageStyle
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView>
      <View className="gap-4 px-4 py-5">
        <View className="flex-row items-center gap-4">
          <Pressable
            className="size-20 items-center justify-center rounded-full bg-gray-300 opacity-70"
            onPress={onChangeProfileAvatar}
          >
            {session?.avatar ? (
              <Image
                source={{ uri: session?.avatar || "" }}
                style={{ width: 80, height: 80, borderRadius: 999 }}
              />
            ) : (
              <Text className="text-2xl">{session?.firstName?.[0]}</Text>
            )}
          </Pressable>

          <View>
            <Text className="text-lg font-medium">
              {session?.firstName} {session?.lastName}
            </Text>
            <Text className="text-gray-500">{session?.email}</Text>
          </View>
        </View>

        <View className="mt-1">
          <Text className="mb-2 text-gray-900">First Name</Text>
          <View className="relative">
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: "First Name is Required",
                minLength: {
                  value: 1,
                  message: "First Name is Required",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={firstNameRef}
                  placeholder="First name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className="rounded-md border border-gray-200 bg-white p-3"
                />
              )}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName.message}</Text>
            )}
            <SimpleLineIcons
              name="pencil"
              size={20}
              onPress={() => firstNameRef.current?.focus()}
              style={{
                color: "#64748B60",
                position: "absolute",
                right: 12,
                top: 15,
              }}
            />
          </View>
        </View>
        <View>
          <Text className="mb-2 text-gray-900">Last Name</Text>
          <View className="relative">
            <Controller
              control={control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={lastNameRef}
                  placeholder="Last name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{
                    padding: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                />
              )}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName.message}</Text>
            )}
            <SimpleLineIcons
              name="pencil"
              size={20}
              onPress={() => lastNameRef.current?.focus()}
              style={{
                color: "#64748B60",
                position: "absolute",
                right: 12,
                top: 15,
              }}
            />
          </View>
        </View>
        <View>
          <Text className="mb-2 text-gray-900">Old Password</Text>
          <View className="relative">
            <Controller
              control={control}
              name="oldPassword"
              rules={{
                validate: {
                  hasUpperCase: (value) =>
                    !value ||
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowerCase: (value) =>
                    !value ||
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    !value ||
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                  hasSpecialChar: (value) =>
                    !value ||
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Password must contain at least one special character",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={newPasswordRef}
                  placeholder="Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry={!isOldPasswordVisible}
                  style={{
                    padding: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                />
              )}
            />

            <SimpleLineIcons
              name="eye"
              size={20}
              onPress={() => {
                setIsOldPasswordVisible(!isOldPasswordVisible);
                oldPasswordRef.current?.focus();
              }}
              style={{
                color: "#64748B60",
                position: "absolute",
                right: 12,
                top: 15,
              }}
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword.message}</Text>
            )}
          </View>
        </View>
        <View>
          <Text className="mb-2 text-gray-900">New Password</Text>
          <View className="relative">
            <Controller
              control={control}
              name="newPassword"
              rules={{
                validate: {
                  hasUpperCase: (value) =>
                    !value ||
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowerCase: (value) =>
                    !value ||
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    !value ||
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                  hasSpecialChar: (value) =>
                    !value ||
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Password must contain at least one special character",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={newPasswordRef}
                  placeholder="Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry={!isNewPasswordVisible}
                  style={{
                    padding: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                />
              )}
            />

            <SimpleLineIcons
              name="eye"
              size={20}
              onPress={() => {
                setIsNewPasswordVisible(!isNewPasswordVisible);
                newPasswordRef.current?.focus();
              }}
              style={{
                color: "#64748B60",
                position: "absolute",
                right: 12,
                top: 15,
              }}
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword.message}</Text>
            )}
          </View>
        </View>
        <View>
          <Text className="mb-2 text-gray-900">Organisation Name</Text>
          <View className="relative">
            <Controller
              control={control}
              name="organisationName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={organisationNameRef}
                  placeholder="Organisation Name"
                  //@ts-ignore
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{
                    padding: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                />
              )}
            />
            <SimpleLineIcons
              name="pencil"
              size={20}
              onPress={() => organisationNameRef.current?.focus()}
              style={{
                color: "#64748B60",
                position: "absolute",
                right: 12,
                top: 15,
              }}
            />
          </View>

          <Pressable
            className="mx-auto mt-4 size-24 items-center justify-center rounded-full bg-gray-200 opacity-75"
            onPress={onChangeOrgLogo}
          >
            {orgDetail?.logo ? (
              <Image
                source={{ uri: orgDetail?.logo }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 999,
                }}
              />
            ) : (
              <Text className="text-lg font-medium">
                {orgDetail?.name[0]?.toUpperCase()}
              </Text>
            )}
          </Pressable>
        </View>
        <Button
          title="Save"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting || isUserUpdating || isOrgUpdating}
        />
      </View>
    </ScrollView>
  );
}
