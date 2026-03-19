import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';

export const initializePushNotifications = async (showNotification) => {
  const info = await Device.getInfo();
  
  // Push notifications don't work in the browser, so we check for native platforms
  if (info.platform === 'web') return;

  try {
    // Request permission to use push notifications
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Here you would typically send this token to your backend to save it for this user
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
      showNotification(notification.body, 'info');
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });

  } catch (error) {
    console.error('Push Notifications Initialization Error:', error);
  }
};
