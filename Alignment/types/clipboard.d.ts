/**
 * This module lets you copy text to the clipboard. It is not yet possible to copy other content types, or to handle paste events.
 */
declare class clipboard {
    /**
     * Write plain text to the clipboard.
     * @param text Will be automatically converted to string if a different type is passed
     */
    public static copyText(text: string | any): void;
}

export = clipboard;
