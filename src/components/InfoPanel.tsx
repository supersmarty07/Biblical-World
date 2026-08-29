import { useAtlasStore } from '../state/useAtlasStore';
import { ConfidenceBadge } from './ConfidenceBadge';
import { CloseIcon, InfoIcon, MapPinIcon } from './Icons';
import { StoryPlayer } from './StoryPlayer';
import { JourneyPlayer } from './JourneyPlayer';
import { CharacterPortrait } from './CharacterPortrait';
import type { BiblicalCharacter } from '../types/domain';

export function InfoPanel() {
  const data = useAtlasStore((s) => s.data);
  const selectedPlaceId = useAtlasStore((s) => s.selectedPlaceId);
  const selectedPersonId = useAtlasStore((s) => s.selectedPersonId);
  const selectedEventId = useAtlasStore((s) => s.selectedEventId);
  const activeStoryId = useAtlasStore((s) => s.activeStoryId);
  const activeJourneyId = useAtlasStore((s) => s.activeJourneyId);
  const infoMode = useAtlasStore((s) => s.infoMode);
  const infoOpen = useAtlasStore((s) => s.infoOpen);
  const setInfoOpen = useAtlasStore((s) => s.setInfoOpen);
  const selectPlace = useAtlasStore((s) => s.selectPlace);
  const selectPerson = useAtlasStore((s) => s.selectPerson);
  const selectEvent = useAtlasStore((s) => s.selectEvent);
  const openStory = useAtlasStore((s) => s.openStory);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const setInfoMode = useAtlasStore((s) => s.setInfoMode);
  const sceneCatalog = useAtlasStore((s) => s.sceneCatalog);
  const openScene = useAtlasStore((s) => s.openScene);

  const place = data?.places.find((item) => item.id === selectedPlaceId);
  const person = data?.people.find((item) => item.id === selectedPersonId);
  const event = data?.events.find((item) => item.id === selectedEventId);
  const sourceMap = new Map(data?.sources.map((source) => [source.id, source]));
  const placeScenes = place ? sceneCatalog.filter((scene) => scene.placeIds.includes(place.id)) : [];

  const close = () => {
    if (place) selectPlace(undefined);
    else if (person) selectPerson(undefined);
    else if (event) selectEvent(undefined);
    else if (activeStoryId) openStory(undefined);
    else if (activeJourneyId) openJourney(undefined);
    setInfoOpen(false);
  };

  const Sources = ({ ids }: { ids: string[] }) => (
    <section className="detail-section">
      <h3>Sources & provenance</h3>
      {ids.map((sourceId) => {
        const source = sourceMap.get(sourceId);
        return source ? (
          <div className="source-row" key={source.id}>
            <strong>{source.title}</strong>
            <small>{source.kind ? `${source.kind.replaceAll('-', ' ')} · ` : ''}{source.author || source.organization || 'Project source'}{source.dateLabel ? ` · ${source.dateLabel}` : source.year ? ` · ${source.year}` : ''}</small>
            <span className={`source-status source-status--${source.kind === 'project-methodology' ? 'project' : source.verificationStatus === 'primary-verified' ? 'verified' : source.verificationStatus === 'research-supplied' ? 'research' : 'pending'}`}>{source.kind === 'project-methodology' ? 'Project-authored methodology' : source.verificationStatus === 'primary-verified' ? 'Primary source verified' : source.verificationStatus === 'research-supplied' ? 'Research packet supplied' : 'External source · verification pending'}</span>
            {source.notes && <p>{source.notes}</p>}
            {source.url && <a href={source.url} target="_blank" rel="noreferrer">Source record ↗</a>}
          </div>
        ) : <div className="source-row source-row--missing" key={sourceId}>Missing source: {sourceId}</div>;
      })}
    </section>
  );

  return (
    <aside className={`info-panel ${infoOpen ? 'info-panel--open' : ''}`} aria-label="Atlas information" aria-hidden={!infoOpen} inert={!infoOpen ? true : undefined}>
      <button className="info-panel__close icon-button" onClick={close} aria-label="Close information panel"><CloseIcon /></button>

      {!place && !person && !event && (
        <>
          <div className="explore-mode-tabs" role="tablist" aria-label="Explore guided content">
            <button role="tab" aria-selected={infoMode === 'stories'} onClick={() => { setInfoMode('stories'); if (activeJourneyId) openStory(undefined); setInfoOpen(true); }}>Stories</button>
            <button role="tab" aria-selected={infoMode === 'journeys'} onClick={() => { setInfoMode('journeys'); if (activeStoryId) openJourney(undefined); }}>Journeys</button>
          </div>
          {infoMode === 'journeys' ? <JourneyPlayer /> : <StoryPlayer />}
        </>
      )}

      {place && (
        <article className="place-detail">
          <div className="place-detail__icon"><MapPinIcon /></div>
          <span className="eyebrow">{place.category} · historical & biblical geography</span>
          <h1>{place.name}</h1>
          {place.aliases.length > 0 && <p className="aliases">Also: {place.aliases.join(', ')}</p>}
          <ConfidenceBadge level={place.confidence.geographicIdentification} />
          {!place.coordinates && <div className="evidence-banner">No normal map pin is shown because a responsible modern coordinate is not established.</div>}
          {place.coordinateRole && <div className="coordinate-role">Map geometry: {place.coordinateRole.replaceAll('-', ' ')}</div>}
          <p className="place-summary">{place.summary}</p>

          <section className="detail-section">
            <h3><InfoIcon /> Why is this shown this way?</h3>
            <p>{place.confidence.explanation}</p>
            {place.locationNote && <p><strong>Location note:</strong> {place.locationNote}</p>}
            <dl className="confidence-grid">
              <div><dt>Identification</dt><dd>{place.confidence.geographicIdentification}</dd></div>
              <div><dt>Interpretation</dt><dd>{place.confidence.historicalInterpretation}</dd></div>
            </dl>
          </section>

          {place.historicalContext && <section className="detail-section"><h3>Historical context</h3><p>{place.historicalContext}</p></section>}
          {place.archaeology && <section className="detail-section"><h3>Archaeology</h3><p>{place.archaeology}</p></section>}

          {place.interpretations && place.interpretations.length > 0 && (
            <section className="detail-section">
              <h3>Competing interpretations</h3>
              <div className="interpretation-list">
                {place.interpretations.map((item) => (
                  <div className="interpretation-card" key={item.title}>
                    <div><strong>{item.title}</strong><ConfidenceBadge level={item.status} /></div>
                    <p>{item.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="detail-section">
            <h3>Scripture references</h3>
            <div className="scripture-list">{place.scripture.map((ref) => <span key={ref.label}>{ref.label}</span>)}</div>
          </section>
          {place.textualReferences && place.textualReferences.length > 0 && <section className="detail-section"><h3>Ancient textual references</h3><div className="scripture-list">{place.textualReferences.map((r) => <span key={`${r.sourceId}:${r.label}`}>{r.label} · {r.kind.replaceAll('-', ' ')}</span>)}</div></section>}
          {place.externalIds && Object.keys(place.externalIds).length > 0 && (
            <section className="detail-section">
              <h3>External identifiers</h3>
              <div className="external-id-list">
                {place.externalIds.pleiades && <a href={`https://pleiades.stoa.org/places/${place.externalIds.pleiades}`} target="_blank" rel="noreferrer">Pleiades {place.externalIds.pleiades} ↗</a>}
                {place.externalIds.wikidata && <a href={`https://www.wikidata.org/wiki/${place.externalIds.wikidata}`} target="_blank" rel="noreferrer">Wikidata {place.externalIds.wikidata} ↗</a>}
              </div>
              <p className="identifier-note">Identifiers are cross-reference keys. They do not override this atlas's geographic-confidence or coordinate-role classifications.</p>
            </section>
          )}

          {data && data.events.some((item) => item.placeIds.includes(place.id)) && (
            <section className="detail-section">
              <h3>Related events</h3>
              <div className="entity-links">
                {data.events.filter((item) => item.placeIds.includes(place.id)).map((item) => <button key={item.id} onClick={() => selectEvent(item.id)}>{item.title}</button>)}
              </div>
            </section>
          )}
          {placeScenes.length > 0 && (
            <section className="detail-section immersive-entry-section">
              <h3>Immersive experiences</h3>
              <div className="immersive-entry-list">
                {placeScenes.map((scene) => (
                  <button className="immersive-entry-card" key={scene.id} onClick={() => openScene(scene.id)}>
                    <span>{scene.renderer.replaceAll('-', ' ')} · {scene.availability}</span>
                    <strong>{scene.title}</strong>
                    <small>{scene.summary}</small>
                  </button>
                ))}
              </div>
            </section>
          )}
          <Sources ids={place.sourceIds} />
        </article>
      )}

      {person && (
        <article className="place-detail entity-detail">
          <CharacterPortrait character={(['abraham', 'isaac', 'jacob', 'joseph', 'moses', 'joshua', 'deborah', 'gideon', 'samson', 'ruth', 'samuel', 'saul', 'david', 'absalom', 'solomon', 'rehoboam', 'jeroboam-i', 'shoshenq-i', 'omri', 'ahab', 'jezebel', 'elijah', 'elisha', 'jehu', 'amos', 'jonah', 'isaiah', 'hezekiah', 'sargon-ii', 'sennacherib', 'josiah', 'jeremiah', 'zedekiah', 'nebuchadnezzar-ii', 'ezekiel', 'daniel', 'cyrus-ii', 'zerubbabel', 'darius-i', 'esther', 'ezra', 'nehemiah', 'alexander-iii', 'antiochus-iv', 'mattathias', 'judas-maccabeus', 'jonathan-apphus', 'simon-thassi', 'john-hyrcanus-i', 'pompey', 'herod-great', 'augustus', 'jesus', 'john-baptist', 'peter', 'mary-magdalene', 'herod-antipas', 'pontius-pilate', 'caiaphas'] as BiblicalCharacter[]).includes(person.id as BiblicalCharacter) ? person.id as BiblicalCharacter : 'generic'} label={person.name} />
          <span className="eyebrow">person · {person.era}</span>
          <h1>{person.name}</h1>
          {person.aliases.length > 0 && <p className="aliases">Also: {person.aliases.join(', ')}</p>}
          <p className="place-summary">{person.summary}</p>
          {person.artisticNote && <div className="evidence-banner">{person.artisticNote}</div>}
          <section className="detail-section"><h3>Scripture references</h3><div className="scripture-list">{person.scripture.map((r) => <span key={r.label}>{r.label}</span>)}</div></section>
          {person.textualReferences && person.textualReferences.length > 0 && <section className="detail-section"><h3>Ancient textual references</h3><div className="scripture-list">{person.textualReferences.map((r) => <span key={`${r.sourceId}:${r.label}`}>{r.label} · {r.kind.replaceAll('-', ' ')}</span>)}</div></section>}
          <section className="detail-section"><h3>Related places</h3><div className="entity-links">{person.relatedPlaceIds.map((id) => { const p = data?.places.find((x) => x.id === id); return p ? <button key={id} onClick={() => selectPlace(id)}>{p.name}</button> : null; })}</div></section>
          {data && data.stories.filter((s) => s.personId === person.id).map((s) => <button className="primary-button" key={s.id} onClick={() => openStory(s.id, 0)}>Open guided story</button>)}
          <Sources ids={person.sourceIds} />
        </article>
      )}

      {event && (
        <article className="place-detail entity-detail">
          <span className="eyebrow">{event.scripture.length ? 'Biblical / historical event' : 'Historical event'} · interpretation {event.confidence}</span>
          <h1>{event.title}</h1>
          <p className="place-summary">{event.summary}</p>
          {event.dating && <section className="detail-section dating-card"><h3>Historical dating</h3><strong>{event.dating.label}</strong><p>Basis: {event.dating.basis}</p>{event.dating.note && <p>{event.dating.note}</p>}</section>}
          {event.historicalNote && <section className="detail-section"><h3>Historical / mapping note</h3><p>{event.historicalNote}</p></section>}
          <section className="detail-section"><h3>Scripture references</h3><div className="scripture-list">{event.scripture.map((r) => <span key={r.label}>{r.label}</span>)}</div></section>
          {event.textualReferences && event.textualReferences.length > 0 && <section className="detail-section"><h3>Ancient textual references</h3><div className="scripture-list">{event.textualReferences.map((r) => <span key={`${r.sourceId}:${r.label}`}>{r.label} · {r.kind.replaceAll('-', ' ')}</span>)}</div></section>}
          {event.placeIds.length > 0 && <section className="detail-section"><h3>Places</h3><div className="entity-links">{event.placeIds.map((id) => { const p = data?.places.find((x) => x.id === id); return p ? <button key={id} onClick={() => selectPlace(id)}>{p.name}</button> : null; })}</div></section>}
          {event.personIds.length > 0 && <section className="detail-section"><h3>People</h3><div className="entity-links">{event.personIds.map((id) => { const p = data?.people.find((x) => x.id === id); return p ? <button key={id} onClick={() => selectPerson(id)}>{p.name}</button> : null; })}</div></section>}
          <Sources ids={event.sourceIds} />
        </article>
      )}
    </aside>
  );
}
