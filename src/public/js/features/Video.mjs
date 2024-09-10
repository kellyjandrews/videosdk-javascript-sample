import { client, publish, subscribe } from '../index.mjs';
import { raw } from '/rawjs/raw.esm.js';
export default class Video {
  constructor(devices) {
    this.stream = client.getMediaStream();
    this.cameras = devices;
    this.button = document.getElementById('video-button');
    this.dropdown = document.getElementById('video-input');
    this.videoStatus = document.getElementById('video-status');
    this.videoPlayerContainer = document.querySelector('video-player-container');
    this._setUpEventHandlers();
    this.createDeviceOptions();
  }

  _setUpEventHandlers = () => {
    client.on('video-active-change', (data) => {
      if (data.state === 'active') {
        publish('VIDEO_ACTIVE', data);
      }
      if (data.state === 'inactive') {
        publish('VIDEO_INACTIVE', data);
      }
    });

    client.on('video-capturing-change', (data) => {
      if (data.state === 'Started') {
        this.videoStatus.innerText = 'On';
        this.renderParticipants();
      } else if (data.state === 'Stopped') {
        this.videoStatus.innerText = 'Off';
        this.renderParticipants();
      }
    });
    client.on('device-change', (data) => {
      this.renderParticipants();
    });
    client.on('peer-video-state-change', (data) => {
      this.renderParticipants();
    });

    this.button.addEventListener('click', this.toggleVideo);
    this.dropdown.addEventListener('change', (e) => {
      this.stream.switchCamera(e.target.value);
    });
  };

  renderParticipants = async () => {
    this.videoPlayerContainer.innerHTML = '';
    try {
      let { height, width } = this.getOptimalVideoSize(client.getAllUser().length);
      client.getAllUser().forEach(async (user) => {
        if (user.bVideoOn) {
          let userVideo = await this.stream.attachVideo(user.userId, 2);
          userVideo = raw.get(userVideo)({ width: `${width}px`, height: `${height}px` }, 'aspect-video');
          this.videoPlayerContainer.appendChild(userVideo);
        }
      });
    } catch (error) {
      // else render initials or something
      console.log(error);
    }
  };

  toggleVideo = async () => {
    client.getCurrentUserInfo();
    if (client.getCurrentUserInfo().bVideoOn) {
      await this.stream.stopVideo();
      await this.stream.detachVideo(client.getCurrentUserInfo().userId);
    } else {
      await this.stream.startVideo();
    }
  };

  createDeviceOptions() {
    this.dropdown.innerHTML = '';
    this.cameras.forEach((camera) => {
      const options = document.createElement('option');
      options.value = camera.deviceId;
      options.innerText = camera.label;
      this.dropdown.appendChild(options);
    });
  }

  containerDimensions = () => {
    let displayWidth = Math.floor(this.videoPlayerContainer.clientWidth);
    let displayHeight = Math.floor(this.videoPlayerContainer.clientHeight);
    return { displayWidth, displayHeight };
  };

  getOptimalResolution({ videoCount, videoDisplayHeight }) {
    const VIDEO_RES = {
      Video_90P: 0,
      Video_180P: 1,
      Video_360P: 2,
      Video_720P: 3
    };

    if (videoDisplayHeight < 180) return VIDEO_RES.Video_90P;
    if (videoCount <= 4 && videoDisplayHeight >= 510) return VIDEO_RES.Video_360P;
    if (videoDisplayHeight >= 270) return VIDEO_RES.Video_180P;
    return VIDEO_RES.Video_90P;
  }

  getOptimalVideoSize(numVideos) {
    let { displayWidth, displayHeight } = this.containerDimensions();
    const maxWidth = displayWidth;
    const maxHeight = displayHeight;

    // Calculate total columns and rows needed
    const columns = Math.ceil(Math.sqrt(numVideos));
    const rows = Math.ceil(numVideos / columns);

    // Calculate available width and height
    const availableWidth = maxWidth / columns;
    const availableHeight = maxHeight / rows;

    // Initialize optimal size
    let optimalWidth = availableWidth;
    let optimalHeight = availableHeight;

    // Calculate 16:9 aspect ratio size for available space
    const aspectRatio = 16 / 9;
    optimalWidth = Math.round(availableHeight * aspectRatio);
    if (optimalWidth > availableWidth) {
      optimalWidth = availableWidth;
      optimalHeight = Math.round(optimalWidth / aspectRatio);
    }

    return {
      width: optimalWidth,
      height: optimalHeight
    };
  }
}
