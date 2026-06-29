import type {
  AdAccountForm,
  GrowthPlatform,
  OrganicAccountForm,
} from "../types/types";

export const platformOptions: { value: GrowthPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
];

export const currencyOptions = [
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
];

export const emptyOrganicForm: OrganicAccountForm = {
  platform: "instagram",
  accountName: "",
  accountId: "",
  accessToken: "",
};

export const emptyAdForm: AdAccountForm = {
  clientName: "",
  accountName: "",
  adAccountId: "",
  accessToken: "",
  currency: "INR",
};
