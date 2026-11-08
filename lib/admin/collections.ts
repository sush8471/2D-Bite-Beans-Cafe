export type TableName =
  | 'menu_categories'
  | 'highlights'
  | 'menu_gallery'
  | 'experience_photos'
  | 'amenities'
  | 'add_ons';

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'image';

export type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  rows?: number;
  min?: number;
  folder?: string;
  full?: boolean;
};

export type CollectionConfig = {
  table: TableName;
  title: string;
  singular: string;
  description: string;
  fields: AdminField[];
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  deleteWarning?: string;
  canDelete?: boolean;
  detailBasePath?: string;
  detailLabel?: string;
};

/**
 * Only the fields a restaurant owner needs are listed here.
 * Everything else (slugs, layout flags, SEO, duplicate labels) stays in the
 * database and keeps its current value, but is not editable from the panel.
 */
export const COLLECTIONS: Record<TableName, CollectionConfig> = {
  menu_categories: {
    table: 'menu_categories',
    title: 'Menu categories',
    singular: 'category',
    description:
      'The sections of the menu, in the order they appear. Open a category to manage its dishes and prices.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Appetizers & Street Food' },
      { name: 'image_url', label: 'Banner image', type: 'image', folder: 'menu/categories', full: true },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'name',
    subtitleField: 'slug',
    imageField: 'image_url',
    canDelete: false,
    detailBasePath: '/admin/menu',
    detailLabel: 'Manage dishes',
  },
  highlights: {
    table: 'highlights',
    title: 'Home highlights',
    singular: 'highlight',
    description: 'The scrolling “Fan Favourites” cards on the home page.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'highlights', required: true, full: true },
      { name: 'badge', label: 'Badge', type: 'text', placeholder: 'Best Seller' },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Premium Bento' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'title',
    subtitleField: 'badge',
    imageField: 'image_url',
  },
  menu_gallery: {
    table: 'menu_gallery',
    title: 'Menu photos',
    singular: 'menu photo',
    description: 'Photos shown in the “Menu Images” carousel on the menu page.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'menu/gallery', required: true, full: true },
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Boba Drinks' },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'label',
    imageField: 'image_url',
  },
  experience_photos: {
    table: 'experience_photos',
    title: 'Cafe photos',
    singular: 'photo',
    description:
      'Photos on the Experience page. Tick “Show on home page” to feature one in the home page “Space” section.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'experience', required: true, full: true },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'The Chandelier Room' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2, full: true },
      { name: 'is_featured_home', label: 'Show on home page', type: 'checkbox' },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'title',
    subtitleField: 'description',
    imageField: 'image_url',
  },
  amenities: {
    table: 'amenities',
    title: 'Amenities',
    singular: 'amenity',
    description:
      'Amenity cards on the Visit page. Tick “Show on home page” to add one to the home page strip.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Dog Friendly' },
      { name: 'icon_url', label: 'Icon', type: 'image', folder: 'amenities', full: true },
      { name: 'show_on_home', label: 'Show on home page', type: 'checkbox' },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'name',
    imageField: 'icon_url',
  },
  add_ons: {
    table: 'add_ons',
    title: 'Add-ons',
    singular: 'add-on',
    description: 'The add-on chips shown at the bottom of the menu.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Cheese' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', required: true, min: 0 },
      { name: 'is_published', label: 'Visible on site', type: 'checkbox' },
    ],
    titleField: 'name',
  },
};

export function getCollection(table: TableName): CollectionConfig {
  return COLLECTIONS[table];
}

export function isTableName(value: string): value is TableName {
  return value in COLLECTIONS;
}
