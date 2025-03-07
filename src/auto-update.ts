import { Endpoints } from '@octokit/types';

type GetReleasesResponse = Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];

const repo = 'EastArctica/JSMacros-Scripts';

function getLatestReleaseInfo() {
    const req = Request.get(`https://api.github.com/repos/${repo}/releases/latest`);
    if (req.responseCode !== 200) return;
    
    const res = JSON.parse(req.text()) as GetReleasesResponse;

    return res[0];
}

function getMetadata(release: GetReleasesResponse[0]) {
    const metadataAsset = release.assets.find(asset => asset.name === 'metadata.json');
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
    if (!latestRelease) throw new Error('[East-Updater] Failed to get latest release info');

    const metadata = getMetadata(latestRelease);
    if (!metadata) throw new Error('[East-Updater] Failed to get metadata');
    if (!metadata[scriptName]) throw new Error('[East-Updater] Metadata does not contain script info');

    let configData = {};
    if (FS.exists('./config/east-tweaks.json')) {
        configData = JSON.parse(FS.open('./config/east-tweaks.json').read());
        if (configData[scriptName]?.version && configData[scriptName].version === metadata[scriptName].version) return;
    }

    const asset = latestRelease.assets.find(asset => asset.name === scriptFile);
    if (!asset) throw new Error('[East-Updater] Failed to find script asset');

    const req = Request.get(asset.browser_download_url);
    if (req.responseCode !== 200) throw new Error('[East-Updater] Failed to download the latest version');

    const newScript = req.text();
    FS.open(path).write(newScript);

    Chat.log(`[East-Updater] Updated ${scriptName} from ${configData[scriptName]?.version || 'unknown'} to ${metadata[scriptName].version}`);
    if (!configData[scriptName]) {
        configData[scriptName] = {};
    }
    configData[scriptName].version = metadata[scriptName].version;
    FS.open('./config/east-tweaks.json').write(JSON.stringify(configData, null, 2));
}

updateScript(__filename);
