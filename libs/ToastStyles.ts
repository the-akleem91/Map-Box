import Toast from "react-native-root-toast";

export const SuccessMessageStyle = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 4,
  backgroundColor: "green",
  textColor: "white",
};
export const ErrorMessageStyle = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 4,
  backgroundColor: "red",
  textColor: "white",
};
