export default class PubSub {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe = (event, callback) => {
    if (!this.subscribers.get(event)) {
      this.subscribers.set(event, new Set());
    }

    this.subscribers.get(event).add(callback);
    return;
  };

  publish = (event, data) => {
    if (!this.subscribers.get(event)) {
      return;
    }
    this.subscribers.get(event).forEach((callback) => callback(data));
  };
}
