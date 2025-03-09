import ChatHelper from './ChatHelper';

function merge<T, U>(target: T, source: U): T & U;
function merge<T, U, V>(target: T, source: U, source2: V): T & U & V;
function merge(target: any, ...sources: any[]): any {
    if (!sources.length) return target;

    sources.forEach((source) => {
        if (source && typeof source === 'object') {
            Object.keys(source).forEach((key) => {
                const srcValue = source[key];
                const tgtValue = target[key];

                if (Array.isArray(srcValue)) {
                    if (!Array.isArray(tgtValue)) {
                        target[key] = [];
                    }
                    srcValue.forEach((item: any, index: number) => {
                        if (isObject(item)) {
                            if (!target[key][index] || !isObject(target[key][index])) {
                                target[key][index] = Array.isArray(item) ? [] : {};
                            }
                            merge(target[key][index], item);
                        } else {
                            target[key][index] = item;
                        }
                    });
                } else if (isPlainObject(srcValue)) {
                    if (!isPlainObject(tgtValue)) {
                        target[key] = {};
                    }
                    merge(target[key], srcValue);
                } else {
                    target[key] = srcValue;
                }
            });
        }
    });

    return target;
}

function isObject(item: any): item is object {
    return item !== null && typeof item === 'object';
}

function isPlainObject(item: any): item is object {
    return Object.prototype.toString.call(item) === '[object Object]';
}

export default class Config {
    public static readConfig<T extends object>(path: string, defaultConfig: T, id: string): T {
        let rootConfig: { [key: string]: any } = {};

        if (FS.exists(path)) {
            const file = FS.open(path);
            try {
                const readFile = file.read();
                if (readFile) {
                    rootConfig = JSON.parse(readFile);
                }
            } catch (e) {
                ChatHelper.error(`Failed to parse config file: ${e}`);
                const backupPath = `${path}-${Date.now()}.bak`;
                ChatHelper.error(`Using default config and backing up the old one to ${backupPath}`);
                FS.open(backupPath).write(file.read());
                rootConfig = {};
            }
        } else {
            const dirs = path.split('/');
            dirs.pop();
            let dir = '';
            for (const d of dirs) {
                dir += `${d}/`;
                if (!FS.exists(dir)) FS.makeDir(dir);
            }
        }

        if (!rootConfig[id]) {
            rootConfig[id] = defaultConfig;
        }

        if (!FS.exists(path)) {
            FS.open(path).write(JSON.stringify(rootConfig, null, 4));
        }

        return merge({}, defaultConfig, rootConfig[id] || {});
    }

    public static writeConfig(path: string, config: object, id: string): void {
        let rootConfig: { [key: string]: any } = {};

        if (FS.exists(path)) {
            const file = FS.open(path);
            try {
                const readFile = file.read();
                if (readFile) {
                    rootConfig = JSON.parse(readFile);
                }
            } catch (e) {
                ChatHelper.error(`Failed to parse config file: ${e}`);
                const backupPath = `${path}-${Date.now()}.bak`;
                ChatHelper.error(`Using default config and backing up the old one to ${backupPath}`);
                FS.open(backupPath).write(file.read());

                ChatHelper.error(`Failed to parse config file when writing: ${e}`);
                rootConfig = {};
            }
        } else {
            const dirs = path.split('/');
            dirs.pop();
            let dir = '';
            for (const d of dirs) {
                dir += `${d}/`;
                if (!FS.exists(dir)) FS.makeDir(dir);
            }
        }

        rootConfig[id] = config;
        FS.open(path).write(JSON.stringify(rootConfig, null, 4));
    }
}
