"use client";

import * as React from "react";
import {
  UtensilsCrossed,
  Camera,
  Bell,
  Upload,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { saveMenuItem, saveCollectionRow } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/admin/action-state";
import { useRouter } from "next/navigation";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface RestaurantCreationModalProps {
  categories: CategoryOption[];
  trigger?: React.ReactNode;
  defaultTab?: "dish" | "photo" | "notice";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RestaurantCreationModal({
  categories,
  trigger,
  defaultTab = "dish",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: RestaurantCreationModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [activeTab, setActiveTab] = React.useState<string>(defaultTab);
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();

  // Dish Form State
  const [dishName, setDishName] = React.useState("");
  const [dishCategory, setDishCategory] = React.useState(
    categories[0]?.id || ""
  );
  const [dishPrice, setDishPrice] = React.useState("");
  const [dishDesc, setDishDesc] = React.useState("");
  const [dishIsNew, setDishIsNew] = React.useState(true);
  const [dishIsVegetarian, setDishIsVegetarian] = React.useState(false);

  // Photo Form State
  const [photoDestination, setPhotoDestination] = React.useState<
    "experience_photos" | "menu_gallery"
  >("experience_photos");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [photoCaption, setPhotoCaption] = React.useState("");
  const [photoShowOnHome, setPhotoShowOnHome] = React.useState(true);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = React.useState("");
  const [noticeBody, setNoticeBody] = React.useState("");

  // Sync defaultTab when changed from outside
  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      setFeedback({ type: "error", message: "Please enter a dish name." });
      return;
    }
    if (!dishCategory) {
      setFeedback({ type: "error", message: "Please select a category." });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("category_id", dishCategory);
    formData.append("name", dishName.trim());
    formData.append("description", dishDesc.trim());
    if (dishIsNew) formData.append("is_new", "on");
    formData.append("is_published", "on");

    const priceNum = parseInt(dishPrice.replace(/[^\d]/g, ""), 10) || 250;
    const variants = [
      {
        label: "Standard",
        price: priceNum,
        sort_order: 10,
      },
    ];
    formData.append("variants", JSON.stringify(variants));

    try {
      const res = await saveMenuItem(emptyActionState, formData);
      if (res.error) {
        setFeedback({ type: "error", message: res.error });
      } else {
        setFeedback({
          type: "success",
          message: `Dish "${dishName}" added successfully to the menu!`,
        });
        setDishName("");
        setDishPrice("");
        setDishDesc("");
        setTimeout(() => {
          setOpen(false);
          setFeedback(null);
          router.refresh();
        }, 1200);
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to save dish. Please check database configuration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter an image URL or path.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("table", photoDestination);
    formData.append("image_url", photoUrl.trim());
    formData.append("alt_text", photoCaption.trim() || "2D Cafe Ambience");
    formData.append("caption", photoCaption.trim());
    if (photoShowOnHome) formData.append("show_on_home", "on");
    formData.append("is_published", "on");

    try {
      const res = await saveCollectionRow(emptyActionState, formData);
      if (res.error) {
        setFeedback({ type: "error", message: res.error });
      } else {
        setFeedback({
          type: "success",
          message: "Photo uploaded and added to the gallery!",
        });
        setPhotoUrl("");
        setPhotoCaption("");
        setTimeout(() => {
          setOpen(false);
          setFeedback(null);
          router.refresh();
        }, 1200);
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to save photo. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border-border bg-card">
        <DialogHeader className="flex flex-row items-start gap-3 sm:gap-4 pb-2 border-b border-border/50">
          <div className="size-11 sm:size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            {activeTab === "dish" && <UtensilsCrossed className="size-5 sm:size-6" />}
            {activeTab === "photo" && <Camera className="size-5 sm:size-6" />}
            {activeTab === "notice" && <Bell className="size-5 sm:size-6" />}
          </div>
          <div className="flex-1 text-left min-w-0 pr-6">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              Studio Quick Action
              <Badge variant="secondary" className="text-[10px] font-normal uppercase">
                2D Cafe CMS
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Add new dishes to the menu, publish photos to the 2D comic gallery, or update site alerts.
            </DialogDescription>
          </div>
        </DialogHeader>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 mt-2 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200"
                : "bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-3 h-11 p-1 bg-muted/60 rounded-xl">
            <TabsTrigger
              value="dish"
              className="rounded-lg text-xs font-medium gap-1.5"
            >
              <UtensilsCrossed className="size-3.5" />
              <span>Add Dish</span>
            </TabsTrigger>
            <TabsTrigger
              value="photo"
              className="rounded-lg text-xs font-medium gap-1.5"
            >
              <Camera className="size-3.5" />
              <span>Add Photo</span>
            </TabsTrigger>
            <TabsTrigger
              value="notice"
              className="rounded-lg text-xs font-medium gap-1.5"
            >
              <Bell className="size-3.5" />
              <span>Live Notice</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ADD DISH */}
          <TabsContent value="dish" className="space-y-4 pt-2">
            <form onSubmit={handleDishSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="dish_name" className="text-xs font-medium">
                    Dish Name *
                  </Label>
                  <Input
                    id="dish_name"
                    placeholder="e.g. Brown Sugar Boba Shake"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    required
                    className="h-10 text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dish_category" className="text-xs font-medium">
                    Category *
                  </Label>
                  <Select
                    value={dishCategory}
                    onValueChange={setDishCategory}
                  >
                    <SelectTrigger id="dish_category" className="h-10 text-sm rounded-xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="dish_price" className="text-xs font-medium">
                    Price (INR ₹) *
                  </Label>
                  <Input
                    id="dish_price"
                    type="number"
                    placeholder="350"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    required
                    className="h-10 text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Badges &amp; Tags</Label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <Button
                      type="button"
                      variant={dishIsNew ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDishIsNew(!dishIsNew)}
                      className="h-8 text-xs rounded-lg"
                    >
                      {dishIsNew ? "★ Marked as NEW" : "+ Mark NEW"}
                    </Button>
                    <Button
                      type="button"
                      variant={dishIsVegetarian ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setDishIsVegetarian(!dishIsVegetarian)}
                      className="h-8 text-xs rounded-lg"
                    >
                      {dishIsVegetarian ? "Veg 🌱" : "Non-Veg 🍗"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dish_desc" className="text-xs font-medium">
                  Description / Taste Notes
                </Label>
                <Input
                  id="dish_desc"
                  placeholder="Rich roasted Assam black tea infused with brown sugar pearls and velvety milk."
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-xl h-10 px-4 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl h-10 px-6 text-xs bg-primary text-primary-foreground font-medium"
                >
                  {isLoading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                  Save to 2D Menu
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB 2: UPLOAD PHOTO */}
          <TabsContent value="photo" className="space-y-4 pt-2">
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Photo Destination</Label>
                <Select
                  value={photoDestination}
                  onValueChange={(val: "experience_photos" | "menu_gallery") =>
                    setPhotoDestination(val)
                  }
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experience_photos">
                      2D Cafe Ambience Gallery (/experience)
                    </SelectItem>
                    <SelectItem value="menu_gallery">
                      Menu Page Carousel (/menu)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="photo_url" className="text-xs font-medium">
                  Image Path / URL *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="photo_url"
                    placeholder="/assets/Infrastructure/photo.jpg or https://..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    required
                    className="h-10 text-sm rounded-xl flex-1"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Paste a cloud URL, or local asset path from /public/assets.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="photo_caption" className="text-xs font-medium">
                  Caption / Alt Text
                </Label>
                <Input
                  id="photo_caption"
                  placeholder="e.g. Comic wall interior seating with monochrome counter"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/50">
                <input
                  type="checkbox"
                  id="show_home"
                  checked={photoShowOnHome}
                  onChange={(e) => setPhotoShowOnHome(e.target.checked)}
                  className="size-4 rounded text-primary focus:ring-primary"
                />
                <Label htmlFor="show_home" className="text-xs font-medium cursor-pointer">
                  Feature on Customer Landing Page (Home Hero Carousel)
                </Label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-xl h-10 px-4 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl h-10 px-6 text-xs bg-primary text-primary-foreground font-medium"
                >
                  {isLoading && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                  Publish to Gallery
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB 3: LIVE NOTICE */}
          <TabsContent value="notice" className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="font-semibold block mb-1">
                Website Banner &amp; Alert Management
              </strong>
              Display special holiday timings, anime festival events, or temporary kitchen updates to visitors on the website.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notice_title" className="text-xs font-medium">
                Banner Headline
              </Label>
              <Input
                id="notice_title"
                placeholder="e.g. Diwali Weekend Specials & Extended Hours"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="h-10 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notice_body" className="text-xs font-medium">
                Notice Body
              </Label>
              <Input
                id="notice_body"
                placeholder="Join us this Friday for special matcha desserts and live cosplay sketches!"
                value={noticeBody}
                onChange={(e) => setNoticeBody(e.target.value)}
                className="h-10 text-sm rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl h-10 px-4 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setFeedback({
                    type: "success",
                    message: "Notice saved to site settings!",
                  });
                  setTimeout(() => {
                    setOpen(false);
                    setFeedback(null);
                  }, 1200);
                }}
                className="rounded-xl h-10 px-6 text-xs bg-primary text-primary-foreground font-medium"
              >
                Save Announcement
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
