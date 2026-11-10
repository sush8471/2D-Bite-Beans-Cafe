"use client";

import * as React from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  TrendingUp,
  ArrowUpRight,
  UtensilsCrossed,
  Camera,
  Coffee,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  RestaurantCreationModal,
  type CategoryOption,
} from "@/components/admin/RestaurantCreationModal";

export type RecentDish = {
  id: string;
  name: string;
  categoryName: string;
  priceFormatted: string;
  isPublished: boolean;
  isNew?: boolean;
  updatedAtFormatted?: string;
};

export type StoreSettingsData = {
  brand_name: string;
  address: string;
  maps_url: string;
  hours_days: string;
  hours_time: string;
  phone: string;
  whatsapp_number: string;
  instagram_handle: string;
  instagram_url: string;
  average_spend: string;
};

export interface RestaurantDashboardProps {
  counts: {
    menu_items: number;
    menu_categories: number;
    add_ons: number;
    highlights: number;
    menu_gallery: number;
    experience_photos: number;
    amenities: number;
  };
  settings: StoreSettingsData;
  recentDishes?: RecentDish[];
  categories?: CategoryOption[];
  userEmail?: string;
}

const salesChartConfig = {
  sales: {
    label: "Gross Sales (Rs.)",
    color: "#8B2635",
  },
  target: {
    label: "Target Revenue",
    color: "#a8a29e",
  },
  opened: {
    label: "Orders Inflow",
    color: "#a8a29e",
  },
  completed: {
    label: "Fulfilled Orders",
    color: "#8B2635",
  },
} satisfies ChartConfig;

const salesChartData = [
  { week: "Week 1", sales: 48500, target: 45000, opened: 320, completed: 305 },
  { week: "Week 2", sales: 56200, target: 50000, opened: 410, completed: 390 },
  { week: "Week 3", sales: 52800, target: 55000, opened: 390, completed: 382 },
  { week: "Week 4", sales: 64900, target: 60000, opened: 480, completed: 460 },
  { week: "Week 5", sales: 71400, target: 65000, opened: 540, completed: 525 },
  { week: "Week 6", sales: 79800, target: 70000, opened: 610, completed: 590 },
  { week: "Week 7", sales: 86500, target: 75000, opened: 670, completed: 645 },
  { week: "Week 8", sales: 94200, target: 80000, opened: 730, completed: 710 },
];

function checkIsStoreOpen(hoursTimeStr?: string): {
  isOpen: boolean;
  statusText: string;
  subText: string;
} {
  if (!hoursTimeStr) {
    return {
      isOpen: true,
      statusText: "Open for Service",
      subText: "Standard cafe hours",
    };
  }

  try {
    const now = new Date();
    // Use IST timezone (Asia/Kolkata)
    const istTimeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const [currentHour, currentMin] = istTimeStr.split(":").map(Number);
    const currentMins = currentHour * 60 + currentMin;

    let openMins = 12 * 60;
    let closeMins = 22 * 60;

    const match = hoursTimeStr.match(
      /(\d+)(?::(\d+))?\s*(AM|PM)\s*[-—]\s*(\d+)(?::(\d+))?\s*(AM|PM)/i
    );

    if (match) {
      let startH = parseInt(match[1], 10);
      const startM = parseInt(match[2] || "0", 10);
      const startP = match[3].toUpperCase();
      if (startP === "PM" && startH < 12) startH += 12;
      if (startP === "AM" && startH === 12) startH = 0;
      openMins = startH * 60 + startM;

      let endH = parseInt(match[4], 10);
      const endM = parseInt(match[5] || "0", 10);
      const endP = match[6].toUpperCase();
      if (endP === "PM" && endH < 12) endH += 12;
      if (endP === "AM" && endH === 12) endH = 0;
      closeMins = endH * 60 + endM;
    }

    const isOpen = currentMins >= openMins && currentMins < closeMins;
    return {
      isOpen,
      statusText: isOpen ? "Open for Dine-in & Takeaway" : "Currently Closed",
      subText: isOpen ? "Accepting orders & walk-ins" : "Opens at 12:00 PM",
    };
  } catch {
    return {
      isOpen: true,
      statusText: "Open for Service",
      subText: "Standard cafe hours",
    };
  }
}

export function RestaurantDashboard({
  counts,
  settings,
  recentDishes,
  categories = [],
  userEmail,
}: RestaurantDashboardProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTab, setModalTab] = React.useState<"dish" | "photo" | "notice">(
    "dish"
  );
  const [chartMetric, setChartMetric] = React.useState<"sales" | "orders">(
    "sales"
  );

  const storeStatus = React.useMemo(
    () => checkIsStoreOpen(settings.hours_time),
    [settings.hours_time]
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Top Welcome & Restaurant Quick Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-[#6B1D28] p-5 sm:p-6 text-white shadow-md">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <span
              className={`inline-block size-2 rounded-full ${
                storeStatus.isOpen
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-amber-400"
              }`}
            />
            {storeStatus.statusText}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
            {settings.brand_name || "Bite & Beans"} Content Studio
          </h1>
          <p className="text-sm text-stone-300 mt-0.5">
            Admin: {userEmail || "Manager"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-stone-800/80 hover:bg-stone-700 text-white border-stone-600 h-9"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <span>View 2D Website</span>
              <ExternalLink className="ml-1.5 size-3.5" />
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setModalTab("dish");
              setModalOpen(true);
            }}
            className="bg-rose-700 hover:bg-rose-800 text-white font-medium shadow h-9 gap-1.5"
          >
            <PlusCircle className="size-4" />
            <span>+ Quick Create</span>
          </Button>
        </div>
      </div>

      {/* Sales & Orders Track Graph Component (Replaced previous 2-column layout) */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-stone-50/40 dark:bg-stone-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-[#8B2635] dark:text-rose-400">
                  <TrendingUp className="size-4" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold tracking-tight">
                  Sales Track &amp; Order Performance
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-semibold gap-1"
                >
                  <ArrowUpRight className="size-3" />
                  +14.8% growth
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Weekly gross revenue performance and customer order fulfillment over the last eight weeks.
              </CardDescription>
            </div>

            {/* Toggle metric tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl self-start sm:self-center">
              <button
                type="button"
                onClick={() => setChartMetric("sales")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === "sales"
                    ? "bg-white dark:bg-stone-900 text-[#8B2635] dark:text-rose-300 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Revenue (Rs.)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("orders")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === "orders"
                    ? "bg-white dark:bg-stone-900 text-[#8B2635] dark:text-rose-300 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Orders Throughput
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-1 border-t border-border/40">
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900/60 border border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground block">8-Week Gross Revenue</span>
              <span className="text-base sm:text-lg font-bold text-foreground tracking-tight font-mono">
                Rs. 5,54,300
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900/60 border border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Customer Orders</span>
              <span className="text-base sm:text-lg font-bold text-foreground tracking-tight font-mono">
                4,150 <span className="text-xs font-normal text-muted-foreground">orders</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900/60 border border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground block">Fulfillment Rate</span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
                96.2% <span className="text-xs font-normal text-muted-foreground">fulfilled</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900/60 border border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground block">Average Order Value</span>
              <span className="text-base sm:text-lg font-bold text-foreground tracking-tight font-mono">
                Rs. 385 <span className="text-xs font-normal text-muted-foreground">/ order</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <ChartContainer config={salesChartConfig} className="h-72 sm:h-80 w-full">
            <AreaChart data={salesChartData} margin={{ left: 8, right: 8, top: 10, bottom: 4 }}>
              <defs>
                <linearGradient id="salesMaroonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B2635" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8B2635" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={chartMetric === "sales" ? 64 : 36}
                tickFormatter={(value) =>
                  chartMetric === "sales" ? `Rs.${value / 1000}k` : `${value}`
                }
                className="text-xs text-muted-foreground font-mono"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {chartMetric === "sales" ? (
                <>
                  <Area
                    dataKey="target"
                    name="Target Revenue"
                    type="monotone"
                    stroke="#a8a29e"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <Area
                    dataKey="sales"
                    name="Gross Sales (Rs.)"
                    type="monotone"
                    stroke="#8B2635"
                    strokeWidth={2.5}
                    fill="url(#salesMaroonGradient)"
                  />
                </>
              ) : (
                <>
                  <Area
                    dataKey="opened"
                    name="Orders Inflow"
                    type="monotone"
                    stroke="#a8a29e"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="completed"
                    name="Fulfilled Orders"
                    type="monotone"
                    stroke="#8B2635"
                    fill="url(#salesMaroonGradient)"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Fast Action Shortcuts for Cafe Admin / Manager */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Administrative Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              asChild
              variant="outline"
              className="h-auto flex flex-col items-start gap-1 p-3 text-left hover:border-primary/50"
            >
              <Link href="/admin/menu">
                <UtensilsCrossed className="size-4 text-primary" />
                <span className="text-sm font-medium">Manage Menu</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Dishes, categories &amp; add-ons
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex flex-col items-start gap-1 p-3 text-left hover:border-primary/50"
            >
              <Link href="/admin/photos">
                <Camera className="size-4 text-primary" />
                <span className="text-sm font-medium">Photo Gallery</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  2D interior &amp; dish photos
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex flex-col items-start gap-1 p-3 text-left hover:border-primary/50"
            >
              <Link href="/admin/highlights">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-medium">Home Highlights</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Feature cards &amp; promotions
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex flex-col items-start gap-1 p-3 text-left hover:border-primary/50"
            >
              <Link href="/admin/settings">
                <Coffee className="size-4 text-primary" />
                <span className="text-sm font-medium">Cafe Settings</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Hours, phone, address &amp; social
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adapted Restaurant Creation & Input Modal */}
      <RestaurantCreationModal
        categories={categories}
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultTab={modalTab}
      />
    </div>
  );
}
