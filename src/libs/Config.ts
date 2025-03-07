import ChatHelper from './ChatHelper';
import merge from 'lodash/merge';

export default class Config {
    public static readConfig<T extends object>(path: string, defaultConfig: T, spaces: number = 4): T {
        if (!FS.exists(path)) {
            const dirs = path.split('/');
            dirs.pop();
            let dir = '';
            for (const d of dirs) {
                dir += `${d}/`;
                if (!FS.exists(dir)) FS.makeDir(dir);
            }

            FS.open(path).write(JSON.stringify(defaultConfig, null, spaces));
        }
        const file = FS.open(path);

        try {
            const readFile = file.read();
            if (!readFile) return defaultConfig;
            const parsed = JSON.parse(readFile);
            return merge({}, defaultConfig, parsed);
        } catch (e) {
            ChatHelper.error(`Failed to parse config file: ${e}`);

            const backupPath = `${path}-${Date.now()}.bak`;
            ChatHelper.error(`Using default config and backing up the old one to ${backupPath}`);
            FS.open(backupPath).write(file.read());
            FS.open(path).write(JSON.stringify(defaultConfig, null, spaces));

            return defaultConfig;
        }
    }

    public static writeConfig(path: string, config: object, spaces: number = 4) {
        FS.open(path).write(JSON.stringify(config, null, spaces));
    }
}
