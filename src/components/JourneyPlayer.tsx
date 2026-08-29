import { useMemo } from 'react';
import { useAtlasStore } from '../state/useAtlasStore';
import type { JourneyRecord, JourneySegment } from '../types/domain';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, PlayIcon, RouteIcon } from './Icons';

const FEATURED_GROUPS: Array<{ label: string; description: string; ids: string[] }> = [
  {
    label: 'Abraham',
    description: 'Mesopotamia to Canaan and the Genesis 22 journey toward Moriah.',
    ids: ['journey-abraham', 'journey-moriah']
  },
  {
    label: 'Exodus',
    description: 'Egypt, the sea-crossing region, Sinai wilderness, Kadesh, and the approach to Moab.',
    ids: ['journey-exodus-egypt', 'journey-wilderness-sinai', 'journey-kadesh-transjordan']
  },
  {
    label: 'Jesus',
    description: 'Infancy geography, Galilean ministry corridors, journeys toward Jerusalem, and final-week movements.',
    ids: ['journey-matthew-infancy', 'journey-luke-infancy', 'journey-cana-capernaum', 'journey-john4-samaria', 'journey-northern-ministry', 'journey-final-jerusalem', 'journey-final-week']
  },
  {
    label: 'Paul',
    description: 'Damascus, the three major missionary sequences, transfer to Caesarea, and the voyage to Rome.',
    ids: ['journey-paul-damascus', 'journey-first-mission', 'journey-second-mission', 'journey-third-return', 'journey-paul-caesarea-transfer', 'journey-voyage-to-rome']
  }
];

function certaintyLabel(certainty: JourneySegment['routeCertainty']): string {
  if (certainty === 'known-sequence') return 'Known textual sequence';
  if (certainty === 'reconstructed') return 'Reconstructed route';
  return 'Route unknown';
}

function certaintyExplanation(certainty: JourneySegment['routeCertainty']): string {
  if (certainty === 'known-sequence') return 'The sequence of named places is textually supported. The displayed line between them is not a claim that every road, stop, or bend is known.';
  if (certainty === 'reconstructed') return 'The route geometry is a responsible reconstruction connecting textual or historical anchors; intermediate path details are interpretive.';
  return 'The text or evidence does not establish the traveled path. Any line is a visual orientation aid rather than recovered itinerary geometry.';
}

function JourneyCard({ journey, onOpen }: { journey: JourneyRecord; onOpen: () => void }) {
  const uncertain = journey.segments.filter((segment) => segment.routeCertainty !== 'known-sequence').length;
  return (
    <button className="journey-library__item" onClick={onOpen}>
      <span>{journey.person || 'Journey'} · {journey.segments.length} segment{journey.segments.length === 1 ? '' : 's'}</span>
      <strong>{journey.name}</strong>
      <small>{journey.summary}</small>
      {uncertain > 0 && <em>{uncertain} segment{uncertain === 1 ? '' : 's'} reconstructed or unknown</em>}
    </button>
  );
}

export function JourneyPlayer() {
  const data = useAtlasStore((s) => s.data);
  const activeJourneyId = useAtlasStore((s) => s.activeJourneyId);
  const activeJourneySegment = useAtlasStore((s) => s.activeJourneySegment);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const setJourneySegment = useAtlasStore((s) => s.setJourneySegment);
  const openStory = useAtlasStore((s) => s.openStory);
  const sceneCatalog = useAtlasStore((s) => s.sceneCatalog);
  const openScene = useAtlasStore((s) => s.openScene);
  const selectPlace = useAtlasStore((s) => s.selectPlace);

  const sourceMap = useMemo(() => new Map(data?.sources.map((source) => [source.id, source])), [data]);
  if (!data) return null;

  const journey = data.journeys.find((item) => item.id === activeJourneyId);
  if (!journey) {
    return (
      <section className="journey-library">
        <span className="eyebrow">Follow the Journey · Genesis → Revelation</span>
        <h2>Travel the biblical world</h2>
        <p>Follow existing atlas journey datasets segment by segment. Route certainty is shown explicitly, so textual sequence is not confused with a precisely recovered ancient road.</p>
        <div className="journey-library__groups">
          {FEATURED_GROUPS.map((group) => {
            const journeys = group.ids.map((id) => data.journeys.find((item) => item.id === id)).filter((item): item is JourneyRecord => Boolean(item));
            if (journeys.length === 0) return null;
            return (
              <section key={group.label} className="journey-library__group">
                <div><strong>{group.label}</strong><small>{group.description}</small></div>
                <div className="journey-library__grid">
                  {journeys.map((item) => <JourneyCard key={item.id} journey={item} onOpen={() => openJourney(item.id, 0)} />)}
                </div>
              </section>
            );
          })}
        </div>
        <details className="journey-library__all">
          <summary>Browse all {data.journeys.length} journey datasets</summary>
          <div className="journey-library__grid journey-library__grid--all">
            {[...data.journeys].sort((a, b) => a.name.localeCompare(b.name)).map((item) => <JourneyCard key={item.id} journey={item} onOpen={() => openJourney(item.id, 0)} />)}
          </div>
        </details>
      </section>
    );
  }

  const segmentIndex = Math.min(Math.max(0, activeJourneySegment), Math.max(0, journey.segments.length - 1));
  const segment = journey.segments[segmentIndex];
  const fromPlace = data.places.find((place) => place.id === segment.fromPlaceId);
  const toPlace = data.places.find((place) => place.id === segment.toPlaceId);
  const relatedScenes = sceneCatalog.filter((scene) => scene.placeIds.some((id) => id === segment.fromPlaceId || id === segment.toPlaceId)).slice(0, 4);
  const relatedStoryChapters = data.stories.flatMap((story) => story.chapters.map((chapter, chapterIndex) => ({ story, chapter, chapterIndex }))).filter((entry) => entry.chapter.journeyId === journey.id);

  return (
    <section className="journey-player">
      <div className="journey-player__heading">
        <RouteIcon />
        <span className="eyebrow">Follow the Journey · {journey.person || 'route sequence'}</span>
        <h2>{journey.name}</h2>
        <p>{journey.summary}</p>
      </div>

      <div className="journey-player__progress" aria-label={`Segment ${segmentIndex + 1} of ${journey.segments.length}`}>
        {journey.segments.map((item, index) => <button key={item.id} aria-label={`Go to segment ${index + 1}`} aria-current={index === segmentIndex ? 'step' : undefined} onClick={() => setJourneySegment(index)} />)}
      </div>

      <article className={`journey-segment journey-segment--${segment.routeCertainty}`}>
        <div className="journey-segment__meta"><span>Segment {segmentIndex + 1} / {journey.segments.length}</span><strong>{certaintyLabel(segment.routeCertainty)}</strong></div>
        <h3>{fromPlace?.name || segment.fromPlaceId} <span aria-hidden="true">→</span> {toPlace?.name || segment.toPlaceId}</h3>
        <p>{certaintyExplanation(segment.routeCertainty)}</p>
        {segment.note && <div className="evidence-banner">{segment.note}</div>}
        <div className="journey-segment__places">
          {fromPlace && <button onClick={() => selectPlace(fromPlace.id)}><MapPinIcon /> {fromPlace.name}</button>}
          {toPlace && <button onClick={() => selectPlace(toPlace.id)}><MapPinIcon /> {toPlace.name}</button>}
        </div>
        {segment.scripture.length > 0 && <div className="scripture-chips">{segment.scripture.map((ref) => <span key={ref.label}>{ref.label}</span>)}</div>}
      </article>

      {relatedScenes.length > 0 && (
        <section className="journey-player__section">
          <h3>Enter the landscape</h3>
          <div className="immersive-entry-list">
            {relatedScenes.map((scene) => <button className="immersive-entry-card" key={scene.id} onClick={() => openScene(scene.id)}><span>{scene.renderer.replaceAll('-', ' ')} · {scene.availability}</span><strong>{scene.title}</strong><small>{scene.summary}</small></button>)}
          </div>
        </section>
      )}

      {relatedStoryChapters.length > 0 && (
        <section className="journey-player__section">
          <h3>Guided story connections</h3>
          <div className="entity-links">
            {relatedStoryChapters.map(({ story, chapter, chapterIndex }) => <button key={`${story.id}:${chapter.id}`} onClick={() => openStory(story.id, chapterIndex)}><PlayIcon /> {story.title}: {chapter.title}</button>)}
          </div>
        </section>
      )}

      {segment.sourceIds.length > 0 && (
        <section className="journey-player__section">
          <h3>Sources & route basis</h3>
          <div className="scene-source-list">
            {segment.sourceIds.map((id) => {
              const source = sourceMap.get(id);
              return source ? <div key={id}><strong>{source.title}</strong><small>{source.verificationStatus || (source.kind === 'project-methodology' ? 'project-authored' : 'needs-verification')}</small></div> : <div key={id}><strong>{id}</strong><small>source record not loaded</small></div>;
            })}
          </div>
        </section>
      )}

      <div className="story-card__nav journey-player__nav">
        <button className="icon-button" onClick={() => setJourneySegment(Math.max(0, segmentIndex - 1))} disabled={segmentIndex === 0} aria-label="Previous journey segment"><ChevronLeftIcon /></button>
        <span>{segmentIndex + 1} / {journey.segments.length}</span>
        <button className="icon-button" onClick={() => setJourneySegment(Math.min(journey.segments.length - 1, segmentIndex + 1))} disabled={segmentIndex === journey.segments.length - 1} aria-label="Next journey segment"><ChevronRightIcon /></button>
      </div>
      <button className="text-button" onClick={() => openJourney(undefined)}>Back to all journeys</button>
    </section>
  );
}
