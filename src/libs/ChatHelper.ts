export default class ChatHelper {
    static log(message: string): void {
        Chat.log(message);
    }

    static warn(message: string): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[WARNING] &e${this.escapeAmpersands(message)}`));
    }

    static error(message: string): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[ERROR] &4${this.escapeAmpersands(message)}`));
    }

    static info(message: string): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[INFO] &f${this.escapeAmpersands(message)}`));
    }

    static success(message: string): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[SUCCESS] &a${this.escapeAmpersands(message)})}`));
    }

    private static escapeAmpersands(message: string): string {
        return message.replaceAll('&', '&&');
    }
}
