'use client';

import { useActionState } from 'react';
import { saveSettings } from '@/app/admin/actions';
import ImageField from '@/components/admin/ImageField';
import SubmitButton from '@/components/admin/SubmitButton';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';
import type { SiteSettings } from '@/lib/types';

function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="admin-alert admin-alert--error" role="alert">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="admin-alert admin-alert--success" role="status">
        {state.message}
      </p>
    );
  }
  return null;
}

type TextFieldProps = {
  name: keyof SiteSettings;
  label: string;
  defaultValue: string;
  help?: string;
  full?: boolean;
  textarea?: boolean;
};

function TextField({ name, label, defaultValue, help, full, textarea }: TextFieldProps) {
  return (
    <div className={`admin-field${full ? ' admin-field--full' : ''}`}>
      <label htmlFor={`settings-${name}`}>{label}</label>
      {textarea ? (
        <textarea id={`settings-${name}`} name={name} defaultValue={defaultValue} rows={3} />
      ) : (
        <input id={`settings-${name}`} type="text" name={name} defaultValue={defaultValue} />
      )}
      {help ? <p className="admin-help">{help}</p> : null}
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSettings, emptyActionState);

  return (
    <form action={formAction} className="admin-form">
      <div className="admin-card">
        <h2>Branding &amp; imagery</h2>
        <p className="admin-help">These images are used on the home and visit pages.</p>

        <div className="admin-grid">
          <TextField name="brand_name" label="Brand name" defaultValue={settings.brand_name} full />

          <div className="admin-field">
            <label>Home hero image</label>
            <ImageField name="hero_image_url" defaultValue={settings.hero_image_url} folder="site" />
          </div>

          <div className="admin-field">
            <label>Home “Visit Us” card image</label>
            <ImageField
              name="snapshot_image_url"
              defaultValue={settings.snapshot_image_url}
              folder="site"
            />
          </div>

          <div className="admin-field">
            <label>Visit page image</label>
            <ImageField
              name="visit_image_url"
              defaultValue={settings.visit_image_url}
              folder="site"
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Location &amp; contact</h2>
        <p className="admin-help">Shown on the home snapshot and the Visit page.</p>

        <div className="admin-grid">
          <TextField name="address" label="Address" defaultValue={settings.address} full textarea />
          <TextField name="hours_days" label="Opening days" defaultValue={settings.hours_days} />
          <TextField name="hours_time" label="Opening hours" defaultValue={settings.hours_time} />
          <TextField name="phone" label="Phone" defaultValue={settings.phone} />
          <TextField
            name="whatsapp_number"
            label="WhatsApp number"
            defaultValue={settings.whatsapp_number}
            help="Digits only, including country code (e.g. 918135972387)."
          />
          <TextField
            name="instagram_url"
            label="Instagram URL"
            defaultValue={settings.instagram_url}
            full
          />
          <TextField
            name="average_spend"
            label="Average spend"
            defaultValue={settings.average_spend}
            help="Example: Rs. 200 — 400"
          />
        </div>
      </div>

      <FormMessage state={state} />

      <div className="admin-form__actions admin-form__actions--sticky">
        <SubmitButton>Save site settings</SubmitButton>
      </div>
    </form>
  );
}
