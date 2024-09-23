import { client, publish } from '../index.mjs';
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
        publish('VIDEO_CAPTURING_STARTED', data);
      } else if (data.state === 'Stopped') {
        publish('VIDEO_CAPTURING_STARTED', data);
      }
    });
    client.on('device-change', (data) => {
      this.renderParticipants();
    });
    client.on('peer-video-state-change', (data) => {
      this.renderParticipants();
    });
  };

  renderParticipants = async () => {
    this.videoPlayerContainer.innerHTML = '';
    try {
      client.getAllUser().forEach(async (user) => {
        if (user.bVideoOn) {
          let userVideo = await this.stream.attachVideo(user.userId, 2);
          userVideo = raw.get(userVideo)('grow shrink aspect-video');
          this.videoPlayerContainer.appendChild(userVideo);
        } // else render initials or something
      });
    } catch (error) {
      console.log(error);
    }
  };

  toggle = async () => {
    client.getCurrentUserInfo();
    if (client.getCurrentUserInfo().bVideoOn) {
      await this.stream.stopVideo();
      await this.stream.detachVideo(client.getCurrentUserInfo().userId);
    } else {
      await this.stream.startVideo();
    }
  };

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
}
