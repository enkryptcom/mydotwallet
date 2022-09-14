import { reactive } from "vue";
import { AppStore } from "@/types/store";

export const store = reactive<AppStore>({
  accounts: [],
  extension: undefined,
  signer: undefined,
});
