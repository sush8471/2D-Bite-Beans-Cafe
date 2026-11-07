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
  detailBasePath?: string;
  detailLabel?: string;
};

export const COLLECTIONS: Record<TableName, CollectionConfig> = {
  menu_categories: {
    table: 'menu_categories',
    title: 'Menu categories',
    singular: 'category',
    description:
      'Categories are the accordion sections on the menu page. Sort order controls their position.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Appetizers & Street Food' },
      {
        name: 'slug',
        label: 'Slug',
        type: 'text',
        required: true,
        help: 'Lowercase letters, numbers and hyphens. Used by filters and links.',
        placeholder: 'appetizers',
      },
      { name: 'filter_label', label: 'Filter label', type: 'text', help: 'Short label shown in the filter bar.', placeholder: 'Appetizers' },
      { name: 'icon', label: 'Icon', type: 'text', placeholder: '🍗' },
      { name: 'image_url', label: 'Banner image', type: 'image', folder: 'menu/categories', full: true },
      {
        name: 'is_compact',
        label: 'Compact price list',
        type: 'checkbox',
        help: 'Use a simple price list instead of dish cards. Good for drinks.',
      },
      { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
    ],
    titleField: 'name',
    subtitleField: 'slug',
    imageField: 'image_url',
    deleteWarning: 'Deleting a category also deletes all of its dishes and prices.',
    detailBasePath: '/admin/menu',
    detailLabel: 'Manage dishes',
  },
  highlights: {
    table: 'highlights',
    title: 'Home highlights',
    singular: 'highlight',
    description: 'The horizontally scrolling “Fan Favourites” cards on the home page.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'highlights', full: true },
      { name: 'badge', label: 'Badge', type: 'text', placeholder: 'Best Seller' },
      { name: 'category', label: 'Script category', type: 'text', placeholder: 'Bento' },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Premium Bento' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { name: 'price_label', label: 'Price label', type: 'text', placeholder: 'From Rs. 450' },
      { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
    ],
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'image_url',
  },
  menu_gallery: {
    table: 'menu_gallery',
    title: 'Menu images',
    singular: 'menu image',
    description: 'Photos shown in the “Menu Images” carousel on the menu page.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'menu/gallery', required: true, full: true },
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Boba Drinks' },
      { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
    ],
    titleField: 'label',
    imageField: 'image_url',
  },
  experience_photos: {
    table: 'experience_photos',
    title: 'Experience gallery',
    singular: 'photo',
    description:
      'Photos on the Experience page. Feature a photo to also show it in the home page “Space” section.',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image', folder: 'experience', required: true, full: true },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'The Chandelier Room' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2, full: true },
      { name: 'is_featured_home', label: 'Show on home page', type: 'checkbox' },
      {
        name: 'home_title',
        label: 'Home card title',
        type: 'text',
        help: 'Optional. Falls back to the gallery title.',
      },
      { name: 'home_description', label: 'Home card description', type: 'textarea', rows: 2, full: true },
      { name: 'home_sort_order', label: 'Home sort order', type: 'number', min: 0 },
      { name: 'sort_order', label: 'Gallery sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
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
      'Amenity cards on the Visit page. Choose which ones also appear in the home page feature strip.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Dog Friendly' },
      { name: 'icon_url', label: 'Icon', type: 'image', folder: 'amenities', full: true },
      { name: 'show_on_home', label: 'Show on home page', type: 'checkbox' },
      { name: 'home_sort_order', label: 'Home sort order', type: 'number', min: 0 },
      { name: 'sort_order', label: 'Visit page sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
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
      { name: 'sort_order', label: 'Sort order', type: 'number', min: 0 },
      { name: 'is_published', label: 'Published', type: 'checkbox' },
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
