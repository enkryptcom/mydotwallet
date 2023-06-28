import { apiPromise } from "@/stores";
import { Option, StorageKey } from "@polkadot/types";
import { Nominations } from "@polkadot/types/interfaces";
import { NominatedByMap } from "@/types/staking";

let cachedMap: null | NominatedByMap = null;

addEventListener("message", async () => {
  if (cachedMap) return cachedMap;
  const api = await apiPromise.value;
  const result: [StorageKey, Option<Nominations>][] =
    await api.query.staking.nominators.entries();

  const mapped: NominatedByMap = {};

  for (let i = 0; i < result.length; i++) {
    const [key, optNoms] = result[i];

    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      for (let j = 0; j < targets.length; j++) {
        const validatorId = targets[j].toString();

        if (!mapped[validatorId]) {
          mapped[validatorId] = [];
        }

        mapped[validatorId].push({
          index: j + 1,
          nominatorId,
          submittedIn: submittedIn.toNumber(),
        });
      }
    }
  }
  cachedMap = mapped;
  postMessage(mapped);
});
