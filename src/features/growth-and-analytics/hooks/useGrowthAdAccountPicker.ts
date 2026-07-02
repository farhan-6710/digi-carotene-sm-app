import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

/** @deprecated Use useGrowthSelectedAdAccount */
export function useGrowthAdAccountPicker() {
  return useGrowthSelectedAdAccount();
}
