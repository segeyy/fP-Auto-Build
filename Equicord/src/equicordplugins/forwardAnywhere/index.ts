/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { sendMessage } from "@utils/discord";
import definePlugin, { OptionType } from "@utils/types";
import { Message } from "discord-types/general";

// Taken From Signature :)
const settings = definePluginSettings({
    forwardPreface: {
        description: "What should forwarded from be prefaced with",
        type: OptionType.SELECT,
        options: [
            { label: ">", value: ">", default: true },
            { label: "-#", value: "-#" }
        ]
    }
});

export default definePlugin({
    name: "ForwardAnywhere",
    description: "If a forward fails send it as a normal message also allows nsfw forwards",
    authors: [EquicordDevs.thororen],
    settings,
    patches: [
        {
            find: "#{intl::MESSAGE_FORWARDING_NSFW_NOT_ALLOWED}",
            replacement: {
                match: /if\((\i)\.isNSFW\(\)&&.{0,25}\)\)\)/,
                replace: "if(false)",
            }
        },
        {
            find: "#{intl::MESSAGE_ACTION_FORWARD_TO}",
            replacement: {
                match: /(?<=let (\i)=.{0,25}rejected.{0,25}\);)(?=.{0,25}message:(\i))/,
                replace: "if ($1) return $self.sendForward($1,$2);",
            }
        },
    ],
    sendForward(channels: any, message: Message) {
        for (const c of channels) {
            sendMessage(c.id, {
                content: `${message.content}\n${settings.store.forwardPreface} Forwarded from <#${message.channel_id}>`
            });
        }
    }
});
