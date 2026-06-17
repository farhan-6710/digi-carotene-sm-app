import type {
  NeedsAttentionItem,
  RecentPost,
} from "@/features/dashboard/types/types";

export const needsAttentionItems: NeedsAttentionItem[] = [
  {
    time: "09:00 AM",
    from: "Bloom Skincare - Instagram carousel",
    status: "Missed",
  },
  {
    time: "10:30 AM",
    from: "Northwind Apparel - Product launch post",
    status: "Due Today",
  },
  {
    time: "11:15 AM",
    from: "Urban Eats Co. - Weekend promo",
    status: "Needs Review",
  },
  {
    time: "01:00 PM",
    from: "Peak Fitness - Reels campaign",
    status: "Due Today",
  },
  {
    time: "03:30 PM",
    from: "Luxe Interiors - before/after showcase",
    status: "Needs Review",
  },
  {
    time: "04:45 PM",
    from: "GreenLeaf Organics - Story series",
    status: "Missed",
  },
  {
    time: "05:20 PM",
    from: "Swift Logistics - LinkedIn update",
    status: "Due Today",
  },
  {
    time: "06:15 PM",
    from: "Nova Tech - Feature announcement",
    status: "Needs Review",
  },
];

export const recentPosts: RecentPost[] = [
  {
    time: "09:00 AM",
    client: "Bloom Skincare",
    id: "DC-728",
    postType: "Instagram carousel",
    status: "Posted",
  },
  {
    time: "09:45 AM",
    client: "Northwind Apparel",
    id: "DC-727",
    postType: "Product launch",
    status: "Scheduled",
  },
  {
    time: "10:30 AM",
    client: "Urban Eats Co.",
    id: "DC-726",
    postType: "Weekend promo",
    status: "Posted",
  },
  {
    time: "11:15 AM",
    client: "Peak Fitness",
    id: "DC-725",
    postType: "Reels campaign",
    status: "Missed",
  },
  {
    time: "12:00 PM",
    client: "Luxe Interiors",
    id: "DC-724",
    postType: "Before/after",
    status: "Scheduled",
  },
  {
    time: "01:30 PM",
    client: "GreenLeaf Organics",
    id: "DC-723",
    postType: "Story series",
    status: "Posted",
  },
  {
    time: "02:15 PM",
    client: "Swift Logistics",
    id: "DC-722",
    postType: "LinkedIn update",
    status: "Scheduled",
  },
  {
    time: "03:00 PM",
    client: "Nova Tech",
    id: "DC-721",
    postType: "Feature announcement",
    status: "Posted",
  },
];

export const publishingComparisonData = [
  { day: "Day 1", currentMonth: 4, previousMonth: 3 },
  { day: "Day 3", currentMonth: 6, previousMonth: 5 },
  { day: "Day 5", currentMonth: 3, previousMonth: 4 },
  { day: "Day 7", currentMonth: 7, previousMonth: 6 },
  { day: "Day 9", currentMonth: 8, previousMonth: 5 },
  { day: "Day 11", currentMonth: 5, previousMonth: 7 },
  { day: "Day 13", currentMonth: 9, previousMonth: 6 },
  { day: "Day 15", currentMonth: 11, previousMonth: 8 },
  { day: "Day 17", currentMonth: 8, previousMonth: 9 },
  { day: "Day 19", currentMonth: 12, previousMonth: 7 },
  { day: "Day 21", currentMonth: 10, previousMonth: 11 },
  { day: "Day 23", currentMonth: 14, previousMonth: 9 },
  { day: "Day 25", currentMonth: 11, previousMonth: 10 },
  { day: "Day 27", currentMonth: 15, previousMonth: 12 },
  { day: "Day 29", currentMonth: 13, previousMonth: 11 },
  { day: "Day 31", currentMonth: 16, previousMonth: 13 },
];
