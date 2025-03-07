export default class ChatHelper {
    static log(message: any): void {
        Chat.log(message);
    }

    static warn(message: any): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[WARNING] &e${this.escapeAmpersands(message)}`));
    }

    static error(message: any): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[ERROR] &c${this.escapeAmpersands(message)}`));
    }

    static info(message: any): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[INFO] &f${this.escapeAmpersands(message)}`));
    }

    static success(message: any): void {
        Chat.log(Chat.ampersandToSectionSymbol(`&6[SUCCESS] &a${this.escapeAmpersands(message)}`));
    }

    private static escapeAmpersands(message: any): string {
        if (typeof message === 'string') {
            return message.replaceAll('&', '&&');
        }

        return message;
    }
}
