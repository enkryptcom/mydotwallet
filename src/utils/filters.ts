import moment from "moment";
import { encodeAddress } from "@polkadot/keyring";
import { ss58Format } from "@/stores";
import BigNumber from "bignumber.js";

export const replaceWithEllipsis = (
  value: string,
  keepLeft: number,
  keepRight: number
): string => {
  if (!value) return "";
  value = value.toString();
  return (
    value.substring(0, keepLeft) +
    "..." +
    value.substring(value.length - keepRight, value.length)
  );
};
export const currencyFormat = (
  value: number | BigNumber,
  currency: string
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });

  if (typeof value === "number") {
    return formatter.format(value);
  } else if ((value as any) instanceof BigNumber) {
    return formatter.format(value.toNumber());
  }

  return value.toString();
};
export const cryptoCurrencyFormat = (value: number | BigNumber): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
  });

  if (typeof value === "number") {
    return formatter.format(value);
  } else if ((value as any) instanceof BigNumber) {
    return formatter.format(value.toNumber());
  }

  return value.toString();
};
export const formatDuration = (
  duration: moment.Duration,
  date: number
): string => {
  if (duration.days() < 0) return moment(date).fromNow();

  const isoString = moment.duration(duration.asMilliseconds()).toISOString();
  const [, , h = "", , m = "", , s = ""] =
    isoString.match(/T((\d+)H)?((\d+)M)?(([\d]+)(\.(\d+))?S)?/) ?? [];

  if (duration.hours() < 0)
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;

  return `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
};
export const formatAddress = (address: string, ss58?: number): string => {
  return encodeAddress(address, ss58 || ss58Format.value || 0);
};
export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};
