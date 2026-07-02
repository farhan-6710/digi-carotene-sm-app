import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Currency } from "@/features/growth-and-analytics/types/types";

type CurrencyRow = {
  code: string;
  name: string;
  symbol: string;
};

function mapCurrency(row: CurrencyRow): Currency {
  return {
    code: row.code,
    name: row.name,
    symbol: row.symbol,
  };
}

export async function fetchCurrencies(): Promise<Currency[]> {
  const { data, error } = await supabase
    .from(DB.CURRENCIES.TABLE)
    .select(DB.CURRENCIES.SELECT)
    .order("code", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as CurrencyRow[]).map(mapCurrency);
}
