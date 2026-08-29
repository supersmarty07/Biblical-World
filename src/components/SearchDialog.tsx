import { useEffect, useMemo, useRef, useState } from 'react';
import { loadOrBuildSearch, type StaticSearchEngine } from '../lib/search';
import { useAtlasStore } from '../state/useAtlasStore';
import { CloseIcon, SearchIcon } from './Icons';

export function SearchDialog() {
  const data = useAtlasStore((s) => s.data);
  const searchOpen = useAtlasStore((s) => s.searchOpen);
  const setSearchOpen = useAtlasStore((s) => s.setSearchOpen);
  const selectPlace = useAtlasStore((s) => s.selectPlace);
  const selectPerson = useAtlasStore((s) => s.selectPerson);
  const selectEvent = useAtlasStore((s) => s.selectEvent);
  const openStory = useAtlasStore((s) => s.openStory);
  const openJourney = useAtlasStore((s) => s.openJourney);
  const openScene = useAtlasStore((s) => s.openScene);
  const sceneCatalog = useAtlasStore((s) => s.sceneCatalog);
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<StaticSearchEngine>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => { if (data) void loadOrBuildSearch(data, sceneCatalog).then(setEngine); }, [data, sceneCatalog]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape' && searchOpen) {
        event.preventDefault();
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.setTimeout(() => inputRef.current?.focus(), 20);
      return;
    }
    restoreFocusRef.current?.focus();
  }, [searchOpen]);

  const results = useMemo(() => {
    if (!engine || query.trim().length < 2) return [];
    return engine.search(query, 12);
  }, [engine, query]);

  if (!searchOpen) return null;
  return (
    <div className="search-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSearchOpen(false); }}>
      <section
        ref={dialogRef}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="atlas-search-title"
        aria-describedby="atlas-search-help"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}
      >
        <h2 id="atlas-search-title" className="visually-hidden">Search the biblical atlas</h2>
        <p id="atlas-search-help" className="visually-hidden">Search places, people, events, stories, journeys, immersive scenes, dates, and Scripture references. Press Escape to close.</p>
        <div className="search-dialog__input">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Eden, Jerusalem, Jesus, Ephesus, Patmos, New Jerusalem…"
            aria-label="Search query"
            aria-controls="atlas-search-results"
          />
          <button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><CloseIcon /></button>
        </div>
        <div className="search-dialog__results" id="atlas-search-results" aria-live="polite">
          {query.trim().length < 2 && <div className="search-hint">Search Genesis → Revelation places, people, events, guided stories, journeys, immersive scenes, dates, and Scripture references. Visionary material is discoverable through its stories and symbolic-place records.</div>}
          {query.trim().length >= 2 && results.length === 0 && <div className="search-hint">No result in the current Genesis → Revelation dataset.</div>}
          {results.map((result) => (
            <button className="search-result" key={`${result.kind}-${result.id}`} onClick={() => {
              if (result.kind === 'place') selectPlace(result.id);
              if (result.kind === 'person') selectPerson(result.id);
              if (result.kind === 'event') selectEvent(result.id);
              if (result.kind === 'story') openStory(result.id, 0);
              if (result.kind === 'journey') openJourney(result.id, 0);
              if (result.kind === 'scene') openScene(result.id);
              setSearchOpen(false);
              setQuery('');
            }}>
              <span className="search-result__kind">{result.kind}</span>
              <strong>{result.name}</strong>
              <small>{result.summary}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
