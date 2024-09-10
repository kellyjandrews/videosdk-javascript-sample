import VideoSDK from '/zoom/index.esm.js';
import PubSub from './pubSub.mjs';
import Session from './features/Session.mjs';
import Notifications from './ui/notifications.mjs';

const client = VideoSDK.createClient();
const { publish, subscribe } = new PubSub();

export { VideoSDK, client, publish, subscribe };

async function startApplication() {
  let session = new Session();
  let notifications = new Notifications();

  await session.joinSession();
}

await startApplication();
