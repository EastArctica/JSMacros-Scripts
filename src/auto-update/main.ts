import { Endpoints } from '@octokit/types';
import Config from '../libs/Config';
import ChatHelper from '../libs/ChatHelper';

type GetReleasesResponse = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

const REPO = 'EastArctica/JSMacros-Scripts';
const CONFIG_PATH = './config/EastArctica-scripts.json';
// This is the number of spaces to use for indentation in the config file
// Some people prefer 2, some prefer 4 or even 8 so I'll leave it configurable
const CONFIG_SPACES = 4;

function getLatestReleaseInfo() {
    const req = Request.get(`https://api.github.com/repos/${REPO}/releases/latest`);
    if (req.responseCode !== 200) return;

    const res = JSON.parse(req.text()) as GetReleasesResponse;

    return res[0];
}

function getMetadata(release: GetReleasesResponse[0]) {
    const metadataAsset = release.assets.find((asset) => asset.name === 'metadata.json');
    if (!metadataAsset) return;

    const metadataUrl = release.assets[1].browser_download_url;
    const req = Request.get(metadataUrl);
    if (req.responseCode !== 200) return;

    return JSON.parse(req.text());
}

function updateScript(path: string) {
    const scriptFile = path.split('\\').pop();
    const scriptName = scriptFile.split('.')[0];
    const latestRelease = getLatestReleaseInfo();
    if (!latestRelease) return ChatHelper.error('[Updater] Failed to get latest release info');

    const metadata = getMetadata(latestRelease);
    if (!metadata) return ChatHelper.error('[Updater] Failed to get metadata');
    if (!metadata[scriptName]) return ChatHelper.error('[Updater] Metadata does not contain script info');
    const latestVersion = metadata[scriptName].version;

    const config = Config.readConfig(CONFIG_PATH, {
        updater: {
            [scriptName]: {
                version: '0.0.0',
            },
        },
    });
    const currentVersion = config.updater[scriptName].version;
    if (currentVersion === latestVersion) return;

    const asset = latestRelease.assets.find((asset) => asset.name === scriptFile);
    if (!asset) return ChatHelper.error('[Updater] Failed to find script asset');

    const req = Request.get(asset.browser_download_url);
    if (req.responseCode !== 200) return ChatHelper.error('[Updater] Failed to download the latest version');

    const newScript = req.text();
    FS.open(path).write(newScript);

    Chat.log(
        `[Updater] Updated ${scriptName} from ${config[scriptName].version || 'unknown'} to ${metadata[scriptName].version}`
    );

    config.updater[scriptName].version = metadata[scriptName].version;
    Config.writeConfig(CONFIG_PATH, config, CONFIG_SPACES);
}

updateScript(__filename);
