import { publish, client } from '../index.mjs';

export default class Audio {
  constructor(devices) {
    this.stream = client.getMediaStream();
    this.stream.startAudio();
    this.microphones = devices.audioInput;
    this.speakers = devices.audioOutput;
    this._setUpEventHandlers();
  }

  _setUpEventHandlers = () => {};

  toggle = async () => {
    client.getCurrentUserInfo();
    if (client.getCurrentUserInfo().muted) {
      this.stream.unmuteAudio();
    } else {
      this.stream.muteAudio();
    }
  };
}
