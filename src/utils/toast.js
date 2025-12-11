import Toast from "react-native-toast-message";

export const showToast = (msg) => {
  Toast.show({
    type: "success",
    text1: msg,
    position: "bottom",
    visibilityTime: 1600,
  });
};
