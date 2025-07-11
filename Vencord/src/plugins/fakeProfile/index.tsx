/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addProfileBadge, BadgePosition, ProfileBadge, removeProfileBadge } from "@api/Badges";
import { addMessageDecoration, removeMessageDecoration } from "@api/MessageDecorations";
import { definePluginSettings } from "@api/Settings";
import { classNameFactory, enableStyle } from "@api/Styles";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Link } from "@components/Link";
import { Devs } from "@utils/constants";
import { debounce } from "@utils/index";
import { Margins } from "@utils/margins";
import { copyWithToast } from "@utils/misc";
import { closeModal, Modals, openModal } from "@utils/modal";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Button, Forms, Toasts, Tooltip, useEffect, useState } from "@webpack/common";
import { User } from "discord-types/general";
import virtualMerge from "virtual-merge";

import { API_URL, BASE_URL, SKU_ID, SKU_ID_DISCORD, VERSION } from "./constants";

const CustomizationSection = findComponentByCodeLazy(".customizationSectionBackground");
const cl = classNameFactory("vc-decoration-");



import style from "./index.css?managed";
import { AvatarDecoration, Colors, fakeProfileSectionProps, Nameplate, ProfileEffectConfig, UserProfile, UserProfileData } from "./types";

let UsersData = {} as Record<string, UserProfileData>;
let CustomEffectsData: Record<string, ProfileEffectConfig> = {};

const UserBadges: Record<string, ProfileBadge[]> = {};
const updateBadgesForAllUsers = () => {
    Object.keys(UsersData).forEach(userId => {
        const newBadges = UsersData[userId].badges;
        const existingBadges = UserBadges[userId] || [];
        if (newBadges) {
            newBadges.forEach((badge, index) => {
                const existingBadge = existingBadges[index];
                if (!existingBadge) {
                    const newBadge = {
                        image: badge.icon,
                        position: BadgePosition.START,
                        description: badge.description,
                        link: badge.link || "https://github.com/gujarathisampath/fakeProfile",
                        shouldShow: userInfo => userInfo.userId === userId
                    } as {
                        image: string;
                        position: BadgePosition;
                        description: string;
                        link: string;
                        shouldShow: (userInfo: any) => boolean;
                        id?: string;
                    };
                    if (badge.badge_id) {
                        newBadge.id = badge.badge_id;
                    }
                    addProfileBadge(newBadge);
                    if (!UserBadges[userId]) {
                        UserBadges[userId] = [];
                    }
                    UserBadges[userId].splice(index, 0, newBadge);
                }
            });
        }
        existingBadges.forEach((existingBadge, index) => {
            const badgeStillExists = newBadges && newBadges[index];

            if (!badgeStillExists) {
                removeProfileBadge(existingBadge);
                UserBadges[userId].splice(index, 1);
            }
        });
    });
};

const CACHE_DURATION = 10 * 60 * 1000;
let lastFetch = 0;
let updateInterval: NodeJS.Timeout | null = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function loadfakeProfile(force = false) {
    const now = Date.now();
    if (!force && now - lastFetch < CACHE_DURATION) {
        return UsersData;
    }

    let retries = 0;

    const attemptFetch = async (): Promise<Record<string, UserProfileData> | null> => {
        try {
            const response = await fetch(API_URL + "/fakeProfile", {
                cache: force ? "no-cache" : "default",
                headers: { "Cache-Control": force ? "no-cache" : "max-age=600" }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            setTimeout(() => {
                UsersData = data;
                lastFetch = now;

                if (settings.store.enableCustomBadges) {
                    debouncedUpdateBadges();
                }
            }, 1000);

            return data;
        } catch (error) {
            console.error(`[fakeProfile] Error loading profile data (attempt ${retries + 1}/${MAX_RETRIES}):`, error);

            if (retries < MAX_RETRIES) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return attemptFetch();
            }

            return null;
        }
    };

    return attemptFetch();
}

const debouncedUpdateBadges = debounce(() => {
    updateBadgesForAllUsers();
}, 1500);

async function loadCustomEffects(force = false) {
    let retries = 0;

    const attemptFetch = async (): Promise<Record<string, ProfileEffectConfig> | null> => {
        try {
            const response = await fetch(BASE_URL + "/profile-effects", {
                cache: force ? "no-cache" : "default",
                headers: {
                    "Cache-Control": force ? "no-cache" : "max-age=600"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            setTimeout(() => {
                CustomEffectsData = data;
            }, 800);

            return data;
        } catch (error) {
            console.error(`[fakeProfile] Error loading effects (attempt ${retries + 1}/${MAX_RETRIES}):`, error);

            if (retries < MAX_RETRIES) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return attemptFetch();
            }

            return null;
        }
    };

    return attemptFetch();
}

function getUserEffect(profileId: string) {
    return UsersData[profileId] ? UsersData[profileId].profile_effect : null;
}

function encode(primary: number, accent: number): string {
    const message = `[#${primary.toString(16).padStart(6, "0")},#${accent.toString(16).padStart(6, "0")}]`;
    const padding = "";
    const encoded = Array.from(message)
        .map(x => x.codePointAt(0))
        .filter(x => x! >= 0x20 && x! <= 0x7f)
        .map(x => String.fromCodePoint(x! + 0xe0000))
        .join("");

    return (padding || "") + " " + encoded;
}

function decode(bio: string): Array<number> | null {
    if (bio == null) return null;
    const colorString = bio.match(
        /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u,
    );
    if (colorString != null) {
        const parsed = [...colorString[0]]
            .map(x => String.fromCodePoint(x.codePointAt(0)! - 0xe0000))
            .join("");
        const colors = parsed
            .substring(1, parsed.length - 1)
            .split(",")
            .map(x => parseInt(x.replace("#", "0x"), 16));

        return colors;
    } else {
        return null;
    }
}


const settings = definePluginSettings({

    enableProfileEffects: {
        description: "Allows you to use profile effects",
        type: OptionType.BOOLEAN,
        default: false
    },
    enableNameplate: {
        description: "Allows you to use nameplates",
        type: OptionType.BOOLEAN,
        default: false
    },
    enableProfileThemes: {
        description: "Allows you to use profile themes",
        type: OptionType.BOOLEAN,
        default: false
    },
    enableCustomBadges: {
        description: "Allows you to use custom badges",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    enableAvatarDecorations: {
        description: "Allows you to use discord avatar decorations",
        type: OptionType.BOOLEAN,
        default: false
    },
    showCustomBadgesinmessage: {
        description: "Show custom badges in message",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    nitroFirst: {
        description: "Banner/Avatar to use if both Nitro and fakeProfile Banner/Avatar are present",
        type: OptionType.SELECT,
        options: [
            { label: "Nitro", value: true, default: true },
            { label: "fakeProfile", value: false },
        ]
    },
    voiceBackground: {
        description: "Use fakeProfile banners as voice chat backgrounds",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: true
    }
});


function fakeProfileSection({ hideTitle = false, hideDivider = false, noMargin = false }: fakeProfileSectionProps) {
    return <CustomizationSection
        title={!hideTitle && "fakeProfile"}
        hasBackground={true}
        hideDivider={hideDivider}
        className={noMargin && cl("section-remove-margin")}
    >
        <Flex>
            <Button
                onClick={async () => {
                    await loadCustomEffects(true);
                    await loadfakeProfile(true);
                    updateBadgesForAllUsers();
                    Toasts.show({
                        message: "Successfully refetched fakeProfile!",
                        id: Toasts.genId(),
                        type: Toasts.Type.SUCCESS
                    });
                }}
                size={Button.Sizes.SMALL}
            >
                Refetch fakeProfile
            </Button>
        </Flex>
    </CustomizationSection>;
}

const openModalOnClick = () => {
    const modalKey = openModal(props => (
        <ErrorBoundary noop onError={() => {
            closeModal(modalKey);
            VencordNative.native.openExternal("https://github.com/gujarathisampath/fakeProfile");
        }}>
            <Modals.ModalRoot {...props}>
                <Modals.ModalHeader>
                    <Flex style={{ width: "100%", justifyContent: "center" }}>
                        <Forms.FormTitle
                            tag="h2"
                            style={{
                                width: "100%",
                                textAlign: "center",
                                margin: 0
                            }}
                        >
                            fakeProfile
                        </Forms.FormTitle>
                    </Flex>
                </Modals.ModalHeader>
                <Modals.ModalContent>
                    <div style={{ textAlign: "center" }}>
                        <img
                            role="presentation"
                            src="https://cdn.discordapp.com/emojis/1217777696650563614.webp"
                            alt=""
                            style={{ margin: "auto", display: "block" }}
                        />
                    </div>
                    <div style={{ padding: "0.5em", textAlign: "center" }}>
                        <Forms.FormText>
                            Disclaimer: This badge is generated by the fakeProfile plugin. Please be aware that it may not represent genuine credentials or affiliations. Thank you for your understanding.
                        </Forms.FormText>
                    </div>
                </Modals.ModalContent>
            </Modals.ModalRoot>
        </ErrorBoundary>
    ));
};

function ImageIcon(path: string) {
    return ({ tooltip }: { tooltip: string; }) => (
        <Tooltip text={tooltip} >
            {(tooltipProps: any) => (
                <img {...tooltipProps} src={path} height={20} width={20} />
            )}
        </Tooltip>
    );
}
const BadgeIcon = ({ user, badgeImg, badgeText }: { user: User, badgeImg: string, badgeText: string; }) => {
    if (UsersData[user.id]?.badges) {
        const Icon = ImageIcon(badgeImg);
        const tooltip = badgeText;
        return <Icon tooltip={tooltip} />;
    } else {
        return null;
    }
};



const BadgeMain = ({ user, wantMargin = true, wantTopMargin = false }: { user: User; wantMargin?: boolean; wantTopMargin?: boolean; }) => {

    const validBadges = UsersData[user.id]?.badges;
    if (!validBadges || validBadges.length === 0) return null;

    const icons = validBadges.map((badge, index) => (
        <div key={index} onClick={openModalOnClick} >
            <BadgeIcon
                key={index}
                user={user}
                badgeImg={badge.icon}
                badgeText={badge.description}
            />
        </div>
    ));

    return (
        <span
            className="custom-badge"
            style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: wantMargin ? 4 : 0,
                verticalAlign: "top",
                position: "relative",
                top: wantTopMargin ? 2 : 0,
                padding: !wantMargin ? 1 : 0,
                gap: 2
            }}
        >
            {icons}
        </span>
    );
};


export default definePlugin({
    name: "fakeProfile",
    description: "Unlock Discord profile effects, themes, avatar decorations, and custom badges without the need for Nitro.",
    authors: [{ name: "Sampath", id: 984015688807100419n }, Devs.Alyxia, Devs.Remty, Devs.AutumnVN, Devs.pylix, Devs.TheKodeToad],
    dependencies: ["MessageDecorationsAPI"],
    start: async () => {
        enableStyle(style);

        await Promise.all([
            loadCustomEffects(true),
            loadfakeProfile(true)
        ]);

        if (settings.store.enableCustomBadges) {
            updateBadgesForAllUsers();
        }

        if (settings.store.showCustomBadgesinmessage) {
            addMessageDecoration("custom-badge", props => (
                <ErrorBoundary noop>
                    <BadgeMain
                        user={props.message?.author}
                        wantMargin={true}
                        wantTopMargin={true}
                    />
                </ErrorBoundary>
            ));
        }

        const response = await fetch(BASE_URL + "/fakeProfile");
        const data = await response.json();
        if (data.version !== VERSION) {
            Toasts.show({
                message: "There is an update available for the fakeProfile plugin.",
                id: Toasts.genId(),
                type: Toasts.Type.MESSAGE,
                options: { position: Toasts.Position.BOTTOM }
            });
        }

        const intervalTime = Math.max(data.reloadInterval || 300000, CACHE_DURATION);
        updateInterval = setInterval(async () => {
            const [effects, profiles] = await Promise.all([
                loadCustomEffects(),
                loadfakeProfile()
            ]);

            if (effects || profiles) {
                console.log("[fakeProfile] Data refreshed successfully");
            }
        }, intervalTime);
    },

    stop: () => {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }

        Object.values(UserBadges).flat().forEach(badge => {
            removeProfileBadge(badge);
        });

        if (settings.store.showCustomBadgesinmessage) {
            removeMessageDecoration("custom-badge");
        }
    },
    patches: [
        {
            find: "UserProfileStore",
            replacement: {
                match: /(?<=getUserProfile\(\i\){return )(.+?)(?=})/,
                replace: "$self.profileDecodeHook($1)"
            }
        },
        {
            find: "getAvatarDecorationURL:",
            replacement: {
                match: /(?<=function \i\(\i\){)(?=let{avatarDecoration)/,
                replace: "const vcDecoration=$self.getAvatarDecorationURL(arguments[0]);if(vcDecoration)return vcDecoration;"
            }
        },
        {
            find: "#{intl::USER_SETTINGS_RESET_PROFILE_THEME}",
            replacement: {
                match: /#{intl::USER_SETTINGS_RESET_PROFILE_THEME}\)}\)(?<=color:(\i),.{0,500}?color:(\i),.{0,500}?)/,
                replace: "$&,$self.addCopy3y3Button({primary:$1,accent:$2})"
            }
        },
        {
            find: "DefaultCustomizationSections",
            replacement: {
                match: /(?<=#{intl::USER_SETTINGS_AVATAR_DECORATION}\)},"decoration"\),)/,
                replace: "$self.fakeProfileSection(),"
            }
        },
        {
            find: ".NITRO_BANNER,",
            replacement: {
                match: /\?\(0,\i\.jsx\)\(\i,{type:\i,shown/,
                replace: "&&$self.shouldShowBadge(arguments[0])$&"
            }
        },
        {
            find: "=!1,canUsePremiumCustomization:",
            replacement: {
                match: /(\i)\.premiumType/,
                replace: "$self.premiumHook($1)||$&"
            }
        },
        {
            find: ".banner)==null",
            replacement: {
                match: /(?<=void 0:)\i.getPreviewBanner\(\i,\i,\i\)/,
                replace: "$self.useBannerHook(arguments[0])||$&"

            }
        },
        {
            find: "\"data-selenium-video-tile\":",
            predicate: () => settings.store.voiceBackground,
            replacement: [
                {
                    match: /(?<=function\((\i),\i\)\{)(?=let.{20,40},style:)/,
                    replace: "$1.style=$self.voiceBackgroundHook($1);"
                }
            ]
        },
        {
            find: "getUserAvatarURL:",
            replacement: [
                {
                    match: /(getUserAvatarURL:)(\i),/,
                    replace: "$1$self.getAvatarHook($2),"
                },
                {
                    match: /(getUserAvatarURL:\i\(\){return )(\i)}/,
                    replace: "$1$self.getAvatarHook($2)}"
                }
            ]
        },

        {
            find: "isAvatarDecorationAnimating:",
            group: true,
            replacement: [
                {
                    match: /(?<=TryItOut:\i,guildId:\i}\),)(?<=user:(\i).+?)/,
                    replace: "vcAvatarDecoration=$self.useUserAvatarDecoration($1),"
                },
                {
                    match: /(?<={avatarDecoration:).{1,20}?(?=,)(?<=avatarDecorationOverride:(\i).+?)/,
                    replace: "$1??vcAvatarDecoration??($&)"
                },
                {
                    match: /(?<=size:\i}\),\[)/,
                    replace: "vcAvatarDecoration,"
                }
            ]
        },
        {
            find: "\"ProfileEffectStore\"",
            replacement: {
                match: /getProfileEffectById\((\i)\){return null!=\i\?(\i)\[\i\]:void 0/,
                replace: "getProfileEffectById($1){return $self.getProfileEffectById($1, $2)"
            }
        },
        {
            find: "#{intl::ACCOUNT_SPEAKING_WHILE_MUTED}",
            replacement: [
                {
                    match: /(?<=\i\)\({avatarDecoration:)(\i)(?=,)(?<=currentUser:(\i).+?)/,
                    replace: "$self.useUserAvatarDecoration($1)??$&"
                }
            ]
        },
        {
            find: "#{intl::GUILD_OWNER}),",
            replacement: [
                {
                    match: /user:(\i).{0,150}nameplate:(\i).*?name:null.*?(?=avatar:)/,
                    replace: "$&banner:$self.customnameplate($1, $2),",
                },
                {
                    match: /(?<=\),nameplate:)(\i)/,
                    replace: "$self.nameplate($1)"
                }
            ]
        },
        {
            find: "role:\"listitem\",innerRef",
            replacement: {
                match: /focusProps.\i\}=(\i).*?children:\[/,
                replace: "$&$1.banner,"
            }
        }
    ],
    settingsAboutComponent: () => (

        <Forms.FormSection>
            <Forms.FormTitle tag="h3">Usage</Forms.FormTitle>
            <Link href="https://github.com/gujarathisampath/fakeProfile?tab=readme-ov-file#tutorial-about-plugin">CLICK HERE TO GET CUSTOM PROFILE EFFECTS, CUSTOM BADGES, BANNER OR ANIMATED PFP</Link>
            <Forms.FormText>
                Enable Profile Themes to use fake profile themes. <br />
                To set your own colors:
                <ul>
                    <li>• go to your profile settings</li>
                    <li>• choose your own colors in the Nitro preview</li>
                    <li>• click the "Copy 3y3" button</li>
                    <li>• paste the invisible text anywhere in your bio</li>
                </ul><br />
            </Forms.FormText>
        </Forms.FormSection>
    ),
    settings,
    getProfileEffectById(skuId: string, effects: Record<string, ProfileEffectConfig>) {
        return CustomEffectsData[skuId];
    },
    nameplate(nameplate: Nameplate | undefined) {
        if (!settings.store.enableNameplate && nameplate) return nameplate;
    },
    customnameplate(user: User, nameplate: Nameplate | undefined) {
        const userId = user?.id;
        if (UsersData[userId] && UsersData[userId]?.nameplate && settings.store.enableNameplate) {
            return (<img id={`custom-nameplate-${user.id}`} src={`https://cdn.discordapp.com/assets/collectibles/${UsersData[userId].nameplate.src}static.png`} className="custom-nameplate" />);
        }
        if (UsersData[userId] && UsersData[userId]?.custom_nameplate && settings.store.enableNameplate) {
            const url = UsersData[userId].custom_nameplate;
            const urlStr = typeof url === "object" ? JSON.stringify(url) : url;
            return (<img id={`custom-nameplate-${user.id}`} src={urlStr} className="custom-nameplate" />);
        }
        return null;
    },
    profileDecodeHook(user: UserProfile) {
        if (user) {
            if (settings.store.enableProfileEffects || settings.store.enableProfileThemes) {
                let mergeData: Partial<UserProfile> = {};
                const profileEffect = getUserEffect(user.userId);
                const colors = decode(user.bio);
                if (settings.store.enableProfileEffects && profileEffect) {
                    mergeData = {
                        ...mergeData,
                        profileEffectId: profileEffect

                    };
                }

                if (settings.store.enableProfileThemes && colors) {
                    mergeData = {
                        ...mergeData,
                        premiumType: 2,
                        themeColors: colors
                    };
                }
                return virtualMerge(user, mergeData as UserProfile);
            }
            return user;
        }

        return user;
    },
    SKU_ID_DISCORD,
    SKU_ID,
    useUserAvatarDecoration(user?: User): { asset: string; skuId: string; animated: boolean; } | null {
        const [avatarDecoration, setAvatarDecoration] = useState<{ asset: string; skuId: string; animated: boolean; } | null>(null);

        useEffect(() => {
            const fetchUserAssets = async () => {
                try {
                    if (user?.id) {
                        const userAssetsData = UsersData[user.id];
                        if (userAssetsData?.decoration) {
                            setAvatarDecoration({
                                asset: userAssetsData.decoration?.asset,
                                skuId: userAssetsData.decoration?.skuId,
                                animated: userAssetsData.decoration?.animated
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user assets:", error);
                }
            };
            fetchUserAssets();
        }, [user, UsersData]);

        if (!user || !settings.store.enableAvatarDecorations) {
            return null;
        }

        return avatarDecoration ? {
            asset: avatarDecoration.asset,
            skuId: avatarDecoration.skuId,
            animated: avatarDecoration.animated
        } : null;
    },
    voiceBackgroundHook({ className, participantUserId }: any) {
        if (className.includes("tile_")) {
            if (UsersData[participantUserId]) {
                return {
                    backgroundImage: `url(${UsersData[participantUserId].banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                };
            }
        }
    },

    useBannerHook({ displayProfile }: any) {
        if (displayProfile?.banner && settings.store.nitroFirst) return;
        if (UsersData[displayProfile?.userId] && UsersData[displayProfile?.userId].banner) return UsersData[displayProfile?.userId].banner;
    },

    premiumHook({ userId }: any) {
        if (UsersData[userId]) return 2;
    },

    shouldShowBadge({ displayProfile, user }: any) {
        return displayProfile?.banner && (UsersData[user.id] || settings.store.nitroFirst);
    },
    getAvatarHook: (original: any) => (user: User, animated: boolean, size: number) => {
        if (!settings.store.nitroFirst && user.avatar?.startsWith("a_")) return original(user, animated, size);
        if (animated) {
            return UsersData[user.id]?.avatar ?? original(user, animated, size);
        } else {
            const avatarUrl = UsersData[user.id]?.avatar;
            if (avatarUrl && typeof avatarUrl === "string") {
                const parsedUrl = new URL(avatarUrl);
                const image_name = parsedUrl.pathname.split("/").pop()?.replace("a_", "");
                if (image_name) {
                    return BASE_URL + "/image/" + image_name;
                }
            }
            return original(user, animated, size);
        }
    },
    getAvatarDecorationURL({ avatarDecoration, canAnimate }: { avatarDecoration: AvatarDecoration | null; canAnimate?: boolean; }) {
        if (!avatarDecoration || !settings.store.enableAvatarDecorations) return;
        if (canAnimate && avatarDecoration?.animated !== false) {
            if (avatarDecoration?.skuId === SKU_ID) {
                const url = new URL(`${BASE_URL}/avatar-decoration-presets/a_${avatarDecoration?.asset}.png`);
                return url.toString();
            } else {
                const url = new URL(`https://cdn.discordapp.com/avatar-decoration-presets/${avatarDecoration?.asset}.png`);
                return url.toString();
            }
        } else {
            if (avatarDecoration?.skuId === SKU_ID) {
                const url = new URL(`${BASE_URL}/avatar-decoration-presets/${avatarDecoration?.asset}.png`);
                return url.toString();
            } else {
                const url = new URL(`https://cdn.discordapp.com/avatar-decoration-presets/${avatarDecoration?.asset}.png?passthrough=false`);
                return url.toString();
            }
        }
    },
    fakeProfileSection: ErrorBoundary.wrap(fakeProfileSection),
    toolboxActions: {
        async "Refetch fakeProfile"() {
            await loadCustomEffects(true);
            await loadfakeProfile(true);
            updateBadgesForAllUsers();
            Toasts.show({
                message: "Successfully refetched fakeProfile!",
                id: Toasts.genId(),
                type: Toasts.Type.SUCCESS
            });
        }
    },
    addCopy3y3Button: ErrorBoundary.wrap(function ({ primary, accent }: Colors) {
        return <Button
            onClick={() => {
                const colorString = encode(primary, accent);
                copyWithToast(colorString);
            }}
            color={Button.Colors.PRIMARY}
            size={Button.Sizes.XLARGE}
            className={Margins.left16}
        >Copy 3y3
        </Button >;
    }, { noop: true }),
});
