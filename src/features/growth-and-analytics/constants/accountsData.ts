import type {
  AdAccountForm,
  AdsAccountKind,
  GrowthPlatform,
  OrganicAccountForm,
} from "../types/types";

export const platformOptions: { value: GrowthPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
];

export const adsPlatformOptions: {
  value: AdsAccountKind;
  label: string;
}[] = [
  { value: "meta_ads", label: "Meta" },
  { value: "google_ads", label: "Google" },
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
  platform: "meta_ads",
  clientId: "",
  clientName: "",
  accountName: "",
  adAccountId: "",
  accessToken: "",
  currencyCode: "INR",
  loginCustomerId: "",
  developerToken: "",
  oauthClientId: "",
  oauthClientSecret: "",
  oauthRefreshToken: "",
};
