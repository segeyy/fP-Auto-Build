/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";


export default definePlugin({
    name: "TidalEmbeds",
    description: "Embeds TIDAL songs to make them playable in Discord.",
    authors: [EquicordDevs.vmohammad],
    dependencies: ["MessageUpdaterAPI"],
    patches: [
        {
            find: "}renderEmbeds(",
            replacement: {
                match: /(?<=renderEmbeds\(\i\){.+?embeds\.map\(\((\i),\i\)?=>{)/,
                replace: '$&if($1?.provider?.name === "TIDAL")return null;'
            }
        }
    ],

    renderMessageAccessory({ message }) {
        const tidalEmbed = message.embeds?.find(embed => embed.provider?.name === "TIDAL");
        if (!tidalEmbed) return null;
        const songId = tidalEmbed?.url?.split("/").pop().split("?")[0];
        if (!songId) {
            console.warn("Tidal embed found without song ID", tidalEmbed);
            return null;
        }
        return (
            <div className="tidal-embed">
                <iframe
                    src={`https://embed.tidal.com/tracks/${songId}?disableAnalytics=true`}
                    width="500"
                    height="120"
                    allow="encrypted-media"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    title="TIDAL Embed Player"
                />
            </div>
        );
    }
});
