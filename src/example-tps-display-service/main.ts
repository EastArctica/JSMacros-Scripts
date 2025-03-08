import { updateScript } from '../libs/Updater';
updateScript(file.getAbsolutePath(), 'EastArctica/JSMacros-Scripts', './config/EastArctica-scripts.json');

// services start with minecraft, when enabled and are meant to be persistent scripts.
JsMacros.assertEvent(event, 'Service');

const d2d = Hud.createDraw2D();
let tpsmeter = null;

d2d.setOnInit(
    JavaWrapper.methodToJava(() => {
        tpsmeter = d2d.addText(World.getServerTPS(), 0, d2d.getHeight() - 10, 0xffffff, true);
    })
);

const tickListener = JsMacros.on(
    'Tick',
    JavaWrapper.methodToJava(() => {
        tpsmeter?.setText(World.getServerTPS());
    })
);

d2d.register();

// this fires when the service is stopped
event.stopListener = JavaWrapper.methodToJava(() => {
    d2d.unregister();
    JsMacros.off(tickListener);
});

// This is needed to allow top level variables with duplicate names in different scripts.
export default event;
