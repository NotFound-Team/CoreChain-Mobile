import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

export const requestUserPermission = async () => {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Notification permission granted");
      return true;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
  return enabled;
};

export const getFCMToken = async () => {
  try {
    const hasPermission = await requestUserPermission();
    if (!hasPermission) {
      console.log("User denied notification permission");
      return null;
    }

    // Register the device with FCM
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
    }

    // Get the token
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const setupFCMListeners = (
  showInAppNotification: (title: string, message: string, data?: any) => void,
) => {
  const unsubMessage = messaging().onMessage(async (remoteMessage) => {
    console.log(remoteMessage);
    showInAppNotification(
      remoteMessage.notification?.title || "Thông báo",
      remoteMessage.notification?.body || "Bạn có tin mới",
      remoteMessage.data
    );
  });

  const unsubOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
    showInAppNotification(
      remoteMessage.notification?.title || "Thông báo",
      remoteMessage.notification?.body || "Bạn có tin mới",
      remoteMessage.data
    );
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        showInAppNotification(
          remoteMessage.notification?.title || "Thông báo",
          remoteMessage.notification?.body || "Bạn có tin mới",
          remoteMessage.data
        );
      }
    });

  return () => {
    unsubMessage();
    unsubOpened();
  };
};
