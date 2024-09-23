import { raw } from '/rawjs/raw.esm.js';
import { subscribe } from '../index.mjs';

export default class Controls {
  constructor(session) {
    this.session = session;

    // create video elements
    this.createVideoControls();

    // create audio elements
    this.createAudioControls();

    // create session elements
    this.createSessionControls();
  }
  _setupEventHandlers = () => {
    // subscribe to events here
  };

  createVideoControls() {
    raw.get(document.getElementById('video-tools'))(
      raw.button(
        { id: 'video-button' },
        'rounded bg-gray-300 px-2 py-1',
        raw.text('Video'),
        raw.on('click', this.session.video.toggle)
      ),
      raw.select(
        { id: 'video-input' },
        this.session.video.cameras.map((camera) => this.createDeviceOption(camera.deviceId, camera.label)),
        raw.on('change', (e) => {
          this.stream.video.switchCamera(e.target.value);
        })
      )
    );
  }

  createAudioControls() {
    raw.get(document.getElementById('audio-tools'))(
      raw.button(
        { id: 'audio-button' },
        'rounded bg-gray-300 px-2 py-1',
        raw.text('Audio'),
        raw.on('click', this.session.audio.toggle)
      ),
      raw.select(
        { id: 'audio-input' },
        this.session.audio.microphones.map((mic) => this.createDeviceOption(mic.deviceId, mic.label)),
        raw.on('change', (e) => {
          this.stream.audio.switchMic(e.target.value);
        })
      ),
      raw.select(
        { id: 'audio-output' },
        this.session.audio.speakers.map((speaker) => this.createDeviceOption(speaker.deviceId, speaker.label)),
        raw.on('change', (e) => {
          this.stream.audio.switchSpeaker(e.target.value);
        })
      )
    );
  }

  createSessionControls() {
    raw.get(document.getElementById('session-tools'))(
      raw.button(
        { id: 'session-button' },
        'rounded bg-gray-300 px-2 py-1',
        raw.text('Leave Session'),
        raw.on('click', this.session.leave)
      )
    );
  }

  createButton(id, text, handler) {
    return raw.button({ id }, raw.text(text)).on('click', handler);
  }

  createDeviceOption(value, label) {
    return raw.option({ value }, raw.text(label));
  }
}
