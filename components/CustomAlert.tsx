import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

interface CustomAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.alertContainer}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="OK" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default CustomAlert;
