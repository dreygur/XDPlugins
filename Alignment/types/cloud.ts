export module cloud {
    /**
     * Interactive prototype view generated via "Share for Review."
     */
    type PrototypeArtifact = {
        /**
         * Set to ArtifactType.PROTOTYPE
         */
        type: ArtifactType.PROTOTYPE,
        /**
         * URL to view in browser
         */
        url: string,
        /**
         * Name of shared artifact (often, but not always, matches the document name)
         */
        name: string,
        /**
         * Level of access protection
         */
        accessLevel: AccessLevel,
        /**
         * True if stakeholders can post comments on this artifact
         */
        allowComments: boolean,
        /**
         * URL for embedding a view of the prototype inside an iframe (compact view with minimal surrounding UI)
         */
        embedURL: string,
        /**
         * iframe width needed to display embedURL. May include room for navigation UI in addition to the prototype's content itself.
         */
        embedWidth: number,
        /**
         * iframe height needed to display embedURL. May include room for navigation UI in addition to the prototype's content itself.
         */
        embedHeight: number,
        /**
         * True if prototype defaults to a view that fills the entire page, with no surrounding UI visible for navigation, commenting, etc.
         */
        fullscreenInPage: boolean,
        /**
         * True if clicking in non-interactive parts of the prototype flashes visual hints indicating the interactive spots
         */
        hotspotHints: boolean
    }

    /**
     * Developer-oriented specs view generated via "Share for Development."
     */
    type SpecsArtifact = {
        type: ArtifactType.SPECS,
        /**
         * URL to view in browser
         */
        url: string,
        /**
         * Name of shared artifact (often, but not always, matches the document name)
         */
        name: string,
        /**
         * Level of access protection
         */
        accessLevel: AccessLevel,
        /**
         * True if stakeholders can post comments on this artifact
         */
        allowComments: boolean,
        /**
         * Target platform. Determines which information and measurement units are shown by default.
         */
        targetPlatform: TargetPlatform
    }

    /**
     * Type of shared artifact: interactive prototype or developer-focused specs view
     */
    export enum ArtifactType {
        PROTOTYPE,
        SPECS
    }

    /**
     * Target platform for published design specs
     */
    export enum TargetPlatform  {
        WEB, IOS, ANDROID
    }

    /**
     * Access level of the shared link: accessible to anyone with the link, anyone with the link + password, or only specific Creative Cloud user accounts
     */
    export enum AccessLevel {
        LINKABLE, PASSWORD_PROTECTED, INVITE_ONLY
    }

    /**
     * Get a list of recently shared artifacts generated from this document. Older artifacts may not be included even if the shared links are still live. Shared links that have been deleted from the server (File > Manage Published Links) may still be listed here, as this API only provides a record of recent share actions from XD - not what the links' current status on the server may be.
     *
     * The list may contain a mix of PrototypeArtifact and/or SpecsArtifact, and items are listed in no particular order. If nothing has been shared from this document, an empty array is returned.
     *
     * @return {!Array<!PrototypeArtifact|SpecsArtifact>}
     */
    declare function getSharedArtifacts(): Array<PrototypeArtifact | SpecsArtifact>;
}