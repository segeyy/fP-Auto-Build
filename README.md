# fp-Auto-Build
A automatic build fakeProfile plugin for Vencord, Equicord, etc...

**Current fork version:**

Vencord: ![](https://img.shields.io/github/package-json/v/Vendicated/Vencord?style=for-the-badge&logo=github&logoColor=d3869b&label=&color=1d2021&labelColor=282828) Equicord: ![](https://img.shields.io/github/package-json/v/Equicord/Equicord?style=for-the-badge&logo=github&logoColor=00ffff&label=&color=1d2021&labelColor=282828)
# How to use
> [!NOTE]
> This project is in under development, it can maybe changed. This project not completed yet.

- Clone this repository by terminal and go to cloned repository:
```shell
https://github.com/segeyy/fP-Auto-Build.git
cd fP-Auto-Build/
```

> [!IMPORTANT]
> After choosing build, do for sure these commands:
> ```shell
> npm i -g pnpm
> pnpm i --no-frozen-lockfile
> pnpm build
> ```
> Because there's no gurantee that it will work without these commands and maybe there's no `dist/` folder.

- Now you need choose build folder which client you prefer using:
    - You can use `Vencord/` or any build folder like `Equicord/` for default Discord. But you need do `pnpm inject` command for injecting your default Discord, **make sure that you closed your default Discord fully**.
    - For custom desktop client such like as **Vesktop** or **Equibop** you need choose specific folder:
        - For **Vesktop** users needs `Vencord/` folder.
        - For **Equibop** users needs `Equibop/` folder.
    1. After choosing open custom desktop client settings, ex. `Vesktop Settings`.
    2. Scroll to the end and click `Open Developer Settings`.
    3. Choose `dist/` folder from your build folder and reload desktop client fully. Enjoy.
