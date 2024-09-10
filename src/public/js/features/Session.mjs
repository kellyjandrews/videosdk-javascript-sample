import { VideoSDK, client, publish } from '../index.mjs';
import Video from './Video.mjs';
import Audio from './Audio.mjs';

//manage the session
export default class Session {
  constructor(opts) {
    // check for compatibility
    this.supportFeatures = VideoSDK.checkFeatureRequirements();
    this.mediaCompatibility = VideoSDK.checkSystemRequirements();

    // proceed accordingly -
    VideoSDK.preloadDependentAssets();
    this.sessionData = sessionData;

    client
      .init('en-US', 'Global', {
        patchJsMedia: true,
        leaveOnPageUnload: true,
        enforceMultipleVideos: true
      })
      .then(() => {
        this._setUpEventHandlers();
        return this;
      })
      .catch((e) => console.warn(e));
  }

  _setUpEventHandlers = () => {
    // create seperate event handlers for each event
    client.on('connection-change', (data) => {
      if (data.status === 'connected') {
        publish('CONNECTED', data);
      }
      if (data.status === 'disconnected') {
        publish('DISCONNECTED', data);
      }
      if (data.status === 'reconnecting') {
        publish('RECONNECTING', data);
      }
    });
    client.on('user-added', (data) => publish('USER_ADDED', data));
    client.on('user-removed', (data) => (data.length > 0 ? publish('USER_REMOVED', data) : null));
    client.on('user-updated', (data) => publish('user-updated', data));

    document.getElementById('leave-button').addEventListener('click', this.leaveSession);
  };

  joinSession = async () => {
    let { sessionName, signature, displayName } = this.sessionData;

    this.session = await client.join(sessionName, signature, displayName);
    this.stream = await client.getMediaStream();
    this.devices = await VideoSDK.getDevices();

    new Video(this.devices.filter((device) => device.kind === 'videoinput'));

    new Audio(this.devices.filter((device) => device.kind === 'audioinput' || device.kind === 'audiooutput'));

    return this;
  };

  leaveSession = async () => {
    console.log('leaving session');
    client.leave();
    VideoSDK.destroyClient();
  };
}
