import { publish, subscribe, client } from '../index.mjs';

export default class Audio {
  constructor(devices) {
    this.stream = client.getMediaStream();
    this.stream.startAudio();
    this.speakers = devices.filter((device) => device.kind === 'audiooutput');
    this.microphones = devices.filter((device) => device.kind === 'audioinput');
    this.button = document.getElementById('audio-button');
    this.micDropdown = document.getElementById('audio-input');
    this.speakerDropdown = document.getElementById('audio-output');
    this.audioStatus = document.getElementById('audio-status');
    this.stream.startAudio();
    this._setUpEventHandlers();
    this.createDeviceOptions();
  }

  _setUpEventHandlers = () => {
    document.getElementById('audio-button').addEventListener('click', this.toggleAudio);
    this.speakerDropdown.addEventListener('change', (e) => {
      this.stream.switchSpeaker(e.target.value);
    });
    this.micDropdown.addEventListener('change', (e) => {
      this.stream.switchMicrophone(e.target.value);
    });
  };

  toggleAudio = async () => {
    client.getCurrentUserInfo();
    if (client.getCurrentUserInfo().muted) {
      this.stream.unmuteAudio();
      this.audioStatus.innerHTML = 'Mic On';
    } else {
      this.stream.muteAudio();
      this.audioStatus.innerHTML = 'Muted';
    }
  };

  createDeviceOptions() {
    this.speakerDropdown.innerHTML = '';
    this.micDropdown.innerHTML = '';

    this.speakers.forEach((speaker) => {
      const options = document.createElement('option');
      options.value = speaker.deviceId;
      options.innerText = speaker.label;
      this.speakerDropdown.appendChild(options);
    });
    this.microphones.forEach((microphones) => {
      const options = document.createElement('option');
      options.value = microphones.deviceId;
      options.innerText = microphones.label;
      this.micDropdown.appendChild(options);
    });
  }
}
