import SiteImage from '@/components/SiteImage';
import { copyText, getSiteContent, toCopyMap } from '@/lib/content';
import { safeImageUrl } from '@/lib/utils';

export const metadata = {
  title: 'The 2D Experience',
};

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const content = await getSiteContent();
  const copy = toCopyMap(content);

  return (
    <section className="page experience-page" data-page="experience">
      <header className="experience-page__header container">
        <span className="script-label">
          {copyText(copy, 'experience.header.label', 'Inside the Sketchbook')}
        </span>
        <h1 className="heading-lg">
          {copyText(copy, 'experience.header.title', 'The 2D Experience')}
        </h1>
        <p className="body-text">
          {copyText(
            copy,
            'experience.header.body',
            "Every wall, chair, and detail is designed to make you feel like you've stepped inside a drawing"
          )}
        </p>
      </header>

      {content.experiencePhotos.length > 0 ? (
        <section className="experience-page__gallery reveal-group" aria-label="Cafe interior gallery">
          {content.experiencePhotos.map((photo) => (
            <figure className="gallery-figure reveal" key={photo.id ?? photo.image_url}>
              <div className="gallery-figure__image">
                <SiteImage src={safeImageUrl(photo.image_url)} alt={photo.title} />
              </div>
              <figcaption className="gallery-figure__caption">
                <h3>{photo.title}</h3>
                {photo.description ? <p>{photo.description}</p> : null}
              </figcaption>
            </figure>
          ))}
        </section>
      ) : (
        <div className="container">
          <p className="empty-state">Photos of the space will appear here once they are added.</p>
        </div>
      )}
    </section>
  );
}
