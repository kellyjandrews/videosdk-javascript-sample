import VideoSDK from '/zoom/index.esm.js';
import PubSub from './pubSub.mjs';
import Session from './features/Session.mjs';
import Notifications from './ui/Notifications.mjs';
import Controls from './ui/Controls.mjs';

const client = VideoSDK.createClient();
const { publish, subscribe } = new PubSub();

export { VideoSDK, client, publish, subscribe };

async function startApplication() {
  let session = new Session();
  new Notifications();
  session = await session.join();
  new Controls(session);
}

await startApplication();
