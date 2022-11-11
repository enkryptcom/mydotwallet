import { BrowserName } from "@/types/browser-name";
import UAParser from "ua-parser-js";

export const detect = (): string => {
  const userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "no";
  }

  return browserName;
};

export const extensionUrl = {
  [BrowserName.Chrome]:
    "https://chrome.google.com/webstore/detail/enkrypt-ethereum-polkadot/kkpllkodjeloidieedojogacfhpaihoh",
  [BrowserName.Firefox]:
    "https://addons.mozilla.org/en-US/firefox/addon/enkrypt/",
  [BrowserName.Brave]:
    "https://chrome.google.com/webstore/detail/enkrypt-ethereum-polkadot/kkpllkodjeloidieedojogacfhpaihoh",
  [BrowserName.Edge]:
    "https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl",
  [BrowserName.Opera]:
    "https://addons.opera.com/en/extensions/details/enkrypt/",
  [BrowserName.Safari]:
    "https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309",
};

export const getBrowserName = () => {
  const parser = new UAParser();
  const browser = parser.getBrowser();

  switch (browser.name) {
    case "Chrome":
    case "Chrome Headless":
    case "Chrome WebView":
    case "Chromium":
      return BrowserName.Chrome;
    case "Firefox":
    case "Firefox Focus":
    case "Firefox Reality":
    case "Mozilla":
      return BrowserName.Firefox;
    case "Brave":
      return BrowserName.Brave;
    case "Edge":
      return BrowserName.Edge;
    case "Opera":
    case "Opera Coast":
    case "Opera Mini":
    case "Opera Mobi":
    case "Opera Tablet":
      return BrowserName.Opera;
    case "Safari":
    case "Mobile Safari":
      return BrowserName.Safari;
    default:
      return BrowserName.Chrome;
  }
};
