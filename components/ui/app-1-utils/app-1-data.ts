import { ChartConfig } from "@/components/ui/chart";

export const app1User = {
  name: "Chef Maya Sen",
  initials: "MS",
  role: "General Manager & Head Chef",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const app1ChartConfig = {
  opened: {
    label: "Orders Inflow",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Fulfilled Orders",
    color: "hsl(var(--color-completed, 351 57% 35%))",
  },
} satisfies ChartConfig;

export const app1Chart = [
  { week: "Week 1", opened: 320, completed: 305 },
  { week: "Week 2", opened: 410, completed: 390 },
  { week: "Week 3", opened: 390, completed: 382 },
  { week: "Week 4", opened: 480, completed: 460 },
  { week: "Week 5", opened: 540, completed: 525 },
  { week: "Week 6", opened: 610, completed: 590 },
  { week: "Week 7", opened: 670, completed: 645 },
  { week: "Week 8", opened: 730, completed: 710 },
];

export const app1Projects = [
  {
    id: "proj-1",
    name: "Autumn 2D Sketch Menu Launch",
    description: "New Korean Corndog variants, Boba blends and matcha desserts.",
    status: "In progress" as const,
    progress: 78,
    dueDate: "Nov 15",
    team: [
      {
        name: "Maya Sen",
        initials: "MS",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Arjun Barua",
        initials: "AB",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "proj-2",
    name: "Cafe Photo Corner Lighting Upgrade",
    description: "Monochrome high-contrast LED strips for sharper 2D aesthetic shots.",
    status: "In review" as const,
    progress: 92,
    dueDate: "Nov 12",
    team: [
      {
        name: "Priya Das",
        initials: "PD",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "proj-3",
    name: "Weekend Table Reservation System",
    description: "Slot booking for peak Friday evening and Sunday anime brunch.",
    status: "Planning" as const,
    progress: 35,
    dueDate: "Nov 25",
    team: [
      {
        name: "Rahul Kalita",
        initials: "RK",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Maya Sen",
        initials: "MS",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },
];

export const app1Activity = [
  {
    id: "act-1",
    person: {
      name: "Arjun Barua",
      initials: "AB",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    action: "updated pricing for Brown Sugar Tiger Boba & Matcha Latte",
    time: "10m ago",
  },
  {
    id: "act-2",
    person: {
      name: "Priya Das",
      initials: "PD",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    action: "uploaded 4 new high-res gallery shots for the 2D comic wall",
    time: "35m ago",
  },
  {
    id: "act-3",
    person: {
      name: "Rahul Kalita",
      initials: "RK",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    action: "marked Korean Spicy Tteokbokki as active recommendation",
    time: "2h ago",
  },
  {
    id: "act-4",
    person: {
      name: "Maya Sen",
      initials: "MS",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    action: "published the updated festive business hours for Guwahati cafe",
    time: "4h ago",
  },
];

