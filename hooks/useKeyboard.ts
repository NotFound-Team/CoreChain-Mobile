import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardOpen(true);
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setIsKeyboardOpen(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardOpen,
  };
}
