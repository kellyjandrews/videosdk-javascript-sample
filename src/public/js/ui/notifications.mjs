import { subscribe } from '../index.mjs';

export default class Notifications {
  constructor() {
    // subscribe to the event
    subscribe('USER_ADDED', (data) => {
      this.sendNotification(`${data[0].displayName} has joined the meeting.`);
    });
    subscribe('USER_REMOVED', (data) => {
      this.sendNotification(`${data[0].displayName} has left the meeting.`);
    });
  }
  sendNotification = (message) => {
    if (!('Notification' in window)) {
      // Check if the browser supports notifications
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      const notification = new Notification(message);
    } else if (Notification.permission !== 'denied') {
      //The Notification permission may only be requested from inside a short running user-generated event handler.
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification(message);
        }
      });
    }
  };
}
