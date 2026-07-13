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
];

export const emptyOrganicForm: OrganicAccountForm = {
  platform: "instagram",
  accountName: "",
  accountId: "",
  accessToken: "",
  clientId: "",
  clientName: "",
};

export const emptyAdForm: AdAccountForm = {
  clientId: "",
  clientName: "",
  accountName: "",
  adAccountId: "",
  accessToken: "",
  currencyCode: "INR",
};
