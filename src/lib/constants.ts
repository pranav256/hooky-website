export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hoooky.vercel.app";

export const REPO_URL = "https://github.com/pranav256/Hooky-engine";

export const CLONE_COMMAND = "git clone https://github.com/pranav256/Hooky-engine.git";

export const INSTALL_COMMANDS = {
  unix: `${CLONE_COMMAND}\ncd Hooky-engine\n./main.sh doctor`,
  windows: `${CLONE_COMMAND}\ncd Hooky-engine\nSet-ExecutionPolicy -Scope Process Bypass\n.\\main.ps1 doctor`,
};
