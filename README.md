# JSMacros-Scripts Template

This is a template for compiling, bundling, and allowing automatic updates for [JsMacros](https://github.com/JsMacros/JsMacros) scripts.

**Key Features:**

- **Dependency Bundling:** Uses rspack to bundle external libraries and your script code into a single `.js` file. This allows you to utilize any [GraalJS](https://github.com/oracle/graaljs) compliant packages whether custom or from a package registry like npm within your JsMacros scripts (any package that doesn't rely on browser specific globals or APIs such as `window` or Node specific globals or APIs such as `process`).
- **Multi-File Script Development:** Organize your code into multiple files for better maintainability and project structure. rspack will handle bundling them together.
- **Automatic Updates:** Integrates the `Updater` library to provide a seamless automatic update mechanism for your users. This ensures users are always running the latest version of your scripts.

## Getting Started

This template is designed to get you up and running quickly. Follow these steps to create your own JsMacros-scripts repository:

1. **Create a template of the repository:**
    - Use the green `Use this template` button then `Create a new repository`.
    - Name your repository as you see fit (`JsMacros-Scripts` is a nice simple name)
    - Keep the project public, otherwise the `Updater` library will not work without changes.
2. **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/JsMacros-Scripts
    cd JsMacros-Scripts
    ```
3. **Install dependencies:**
   This template uses [pnpm](https://pnpm.io/) as it's package manager. You can find installation instructions [here](https://pnpm.io/installation).
    ```bash
    pnpm install
    ```
4. **Set up `package.json` (optional):**
   Optionally, set up the fields in `package.json`. This isn't strictly necessary necessary but is generally recommended.
5. **GitHub Actions:**
   This template uses a GitHub Actions workflow to build and release your scripts.
    - If you've never used GitHub Actions before, you may need to enable them in the `Actions` tab of your repository.

## Writing your first script

There are a few things to know before you write your first script.

1. Create a new folder in `src/` using the `kebab-case` format for consistency, though technically, any name _should_ work.
2. Create the following files (replace fields as expected):

`main.ts`

```ts
import { updateScript } from '../libs/Updater';
// Currently, this method does *not* restart the script. Meaning that the old script will still be running until the next execution.
updateScript(file.getAbsolutePath(), 'EastArctica/JSMacros-Scripts', './config/EastArctica-scripts.json');

// Your code here

// An important required part of these scripts which you'll see in the example script is that they always `export default event`. This won't do anything functionally in our case, but is required to make TypeScript treat these files as modules and allow top level variable declarations with "duplicate" names across scripts.
export default event;
```

`manifest.json` (Note that the comments must be removed to be a valid json file)

```json
{
    // This field can be any string (technically anything, although it should be a truthy javascript value to prevent issues)
    // When this field is changed, it triggers scripts using the Updater library to auto-update
    "version": "1.0.0",
    // These fields are not currently used
    "title": "Example TPS Display Service",
    "description": "An example service that displays the current TPS."
}
```

3. Run either `pnpm build` or `pnpm watch` to respectively build once, or watch the files for updates and build on changes.
4. Your output js files should now be in the `dist/` directory at `dist/folder-name.js` and can be run within JsMacros

## Creating your first release

Once your script is in a state ready for release, make sure your code is commited to GitHub and follow these steps to release an update.

> Note: Before the first release, the Updater script will log an error message to chat indicating that no releases were found.

1. [Create a new release in GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)
2. The title, tag name, and description of this release don't impact the GitHub Action or Updater. However, it's best to use a descriptive title and description. For tag, a simple incrementing number works if you wish, as there is no standardized verisoning system due to each script having it's own unique versions.
    > Note: It's important not to add any `.js` files or a `manifest.json` to the release as they may conflict with the files generated by the GitHub Action.
3. Once you finish filling out your desired fields, publish the release with the `Publish release` button.
4. Your release should be complete within a few minutes. After refreshing the page, you should now see the `.js` files and `manifest.json` files in your release. If not, head over to the `Actions` tab and check why it failed or why it's still running.

## Examples

This template comes with the builtin `example-tps-display-service` script from [here](https://jsmacros.wagyourtail.xyz/?/examples/tpsservice.html). This example has been adapted to this template with it's own `manifest.json` and respective `Updater` implementation. Please follow this for guidance or ask in the [JsMacros Discord](https://discord.gg/P6W58J8) if you're running into any issues.

## Updater library

In `src/libs/Updater.ts`, the `updateScript` method is exported. This method takes 3 arguments, the first being the path to the script, the second being the GitHub repository it belongs to, and the third being the config file path. Additionally, this method returns a boolean for whether the script was updated or not (regardless of whether an update was available or not).

If any errors occur during while checking for an update, they are logged to chat and the function will return `false`.

> Note: It's recommended to read over the [Config library](#config-library) section to understand the format and how to use the config file.

**Example:**

```ts
import { updateScript } from '../libs/Updater';
// Currently, this method does *not* restart the script. Meaning that the old script will still be running until the next execution.
updateScript(file.getAbsolutePath(), 'EastArctica/JSMacros-Scripts', './config/EastArctica-scripts.json');
```

## Config Library

In `src/libs/Config.ts`, the `Config` class is exposed which provides a convenient way to manage JSON config files for your JsMacros scripts. It handles reading, writing, and creating default configs. The intent of this is to have one JSON file to manage the config for all your scripts. Rather than having a different config file for each script, this approach maintains a shared config per developer instead.

### Key Features

- **ID-Based Config:** Configs are accessed and modified using a unique `id`, allowing multiple scripts to store their configs within a single shared file.
- **Automatic Default Config:** If a config file does not exist, or if a specific `id` does not exist within the file, the library automatically creates it using a provided default config object for that `id`.
- **Shared Config File:** Designed to use a single config file to manage settings for multiple scripts, primarily reducing file clutter.
- **Error Handling:** Error handling with backup creation in case of parsing failures.
- **Config Merging:** Merges the loaded config for a specific `id` with the default config. This ensures all default properties are present.

### Important Note on the Shared Config File

This config library is designed with the intention of using a single config file (e.g., `author-config.json`) to store the settings for all of your scripts. Each script will access and modify its own config section within this shared file using a unique `id`. This approach simplifies config management and promotes organization, especially when you have multiple scripts.

### Usage

1. **Reading Config:**
   The `Config.readConfig<T>(path: string, defaultConfig: T, id: string): T` method reads a JSON config file from the specified `path` and retrieves the config for the specified `id`.

    - `path`: The file path to the shared config file.
    - `defaultConfig`: An object representing the default config.
    - `id`: A unique string identifier for your script's config within the config file.

    If the file or id does not exist, it is created or added with the `defaultConfig` content. If parsing fails, the `defaultConfig` is returned, and a backup of the corrupted file is created.

    **Example:**

    ```ts
    import Config from '../libs/Config';

    const configPath = './config/author-config.json';
    const scriptId = 'my-script-name'; // Unique ID for this script's config
    // Default config for the first run
    const defaultConfig = {
        enabled: true,
        threshold: 10,
        whitelistPlayers: ['notch'],
    };

    const config = Config.readConfig(configPath, defaultConfig, scriptId);
    // `config` will now contain the config specifically for 'my-script-name'
    console.log(config.enabled); // Access script-specific config properties directly.
    ```

2. **Writing Config:**
   The `Config.writeConfig(path: string, config: object, id: string` method writes a config object to the specified config at the `path` under the provided `id`.

    - `path`: The file path to the shared config file.
    - `config`: The object config to be written for the specified `id`. This will overwrite the existing config for this `id` in the config.
    - `id`: The unique string identifier for your script's config.

    **Example:**

    ```ts
    import Config from '../libs/Config';

    const configPath = './config/author-config.json';
    const scriptId = 'my-script-name'; // Unique ID for this script's config
    const defaultConfig = {
        enabled: true,
        threshold: 10,
        whitelistPlayers: ['notch'],
    };

    const config = Config.readConfig(configPath, defaultConfig, scriptId);

    config.enabled = false;

    Config.writeConfig(configPath, config, scriptId);
    ```

## Preferences

I understand people may not have the same preferences as me for linting, package managers, etc. So I try to be considerate and give people an easy way to go their own way.

By default, none of my tooling is _required_, only recommended. If you choose to compile & bundle scripts in your own way, that's fine! This template is meant to be a base for people to extend off. Nothing in this project requires prettier or pnpm to be functioning (however the GitHub Action may complain or break without pnpm related files, but could be swapped over to npm without much effort).

### Don't like prettier/formatting?

Remove `./vscode/`, `.editorconfig`, `.prettierrc`, and `.prettierignore`

```bash
# Linux/Unix
rm -r ./vscode/ .editorconfig .prettierrc .prettierignore
# Windows (cmd)
del /s /q .vscode\* .editorconfig .prettierrc .prettierignore
# Windows (PowerShell)
Remove-Item -Recurse -Force .vscode, .editorconfig, .prettierrc, .prettierignore
```

Remove `prettier` from `package.json`

```bash
pnpm remove prettier
```

Remove the prettier section from the `lint` script inside `package.json`

### Don't like pnpm?

First off, I would recommend you at least look into it if you weren't aware of it beforehand. However, Id like to mention that following these steps will remove any package lock information as well as may cause issues with the GitHub Action (however I _believe_ everything should work).

If you'd like to remove it, just remove `pnpm-lock.yaml`. Additionally, I believe you may remove `"packageManager": "pnpm@10.6.1` line from the `package-lock.json` file.

## License

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file in the root of this repository for full details.

This license allows you to freely use, modify, distribute, and sublicense the code with proper attribution.
