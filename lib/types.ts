export type SiteSettings = {
  brand_name: string;
  logo_url: string;
  hero_image_url: string;
  visit_image_url: string;
  snapshot_image_url: string;
  address: string;
  maps_url: string;
  hours_days: string;
  hours_time: string;
  phone: string;
  whatsapp_number: string;
  instagram_handle: string;
  instagram_url: string;
  average_spend: string;
  meta_title: string;
  meta_description: string;
  theme_color: string;
};

export type CopyEntry = {
  key: string;
  page: string;
  label: string;
  value: string;
  multiline: boolean;
  sort_order: number;
};

export type MenuVariant = {
  id?: string;
  label: string;
  price: number;
  sort_order: number;
};

export type MenuItem = {
  id?: string;
  name: string;
  description: string | null;
  is_new: boolean;
  sort_order: number;
  is_published: boolean;
  variants: MenuVariant[];
};

export type MenuCategory = {
  id?: string;
  slug: string;
  name: string;
  filter_label: string;
  icon: string;
  image_url: string;
  is_compact: boolean;
  sort_order: number;
  is_published: boolean;
  items: MenuItem[];
};

export type AddOn = {
  id?: string;
  name: string;
  price: number;
  sort_order: number;
  is_published: boolean;
};

export type MenuGalleryImage = {
  id?: string;
  image_url: string;
  label: string;
  sort_order: number;
  is_published: boolean;
};

export type Highlight = {
  id?: string;
  image_url: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  price_label: string;
  sort_order: number;
  is_published: boolean;
};

export type ExperiencePhoto = {
  id?: string;
  image_url: string;
  title: string;
  description: string;
  is_featured_home: boolean;
  home_title: string | null;
  home_description: string | null;
  home_sort_order: number;
  sort_order: number;
  is_published: boolean;
};

export type Amenity = {
  id?: string;
  name: string;
  icon_url: string;
  show_on_home: boolean;
  home_sort_order: number;
  sort_order: number;
  is_published: boolean;
};

export type SiteContent = {
  settings: SiteSettings;
  copy: CopyEntry[];
  categories: MenuCategory[];
  addOns: AddOn[];
  menuGallery: MenuGalleryImage[];
  highlights: Highlight[];
  experiencePhotos: ExperiencePhoto[];
  amenities: Amenity[];
};

export type CopyMap = Record<string, string>;
