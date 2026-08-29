import { useEffect, useMemo, useRef, useState } from 'react';
import type MiniSearch from 'minisearch';
import { loadOrBuildSearch, type SearchDocument } from '../lib/search';
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
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<MiniSearch<SearchDocument>>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (data) void loadOrBuildSearch(data).then(setEngine); }, [data]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) { event.preventDefault(); setSearchOpen(true); }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen]);
  useEffect(() => { if (searchOpen) window.setTimeout(() => inputRef.current?.focus(), 20); }, [searchOpen]);

  const results = useMemo(() => {
    if (!engine || query.trim().length < 2) return [];
    return engine.search(query, { prefix: true, fuzzy: 0.18, boost: { name: 3, scripture: 1.5 } }).slice(0, 12);
  }, [engine, query]);

  if (!searchOpen) return null;
  return (
    <div className="search-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSearchOpen(false); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search atlas">
        <div className="search-dialog__input">
          <SearchIcon />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Eden, Jerusalem, Jesus, Ephesus, Patmos, New Jerusalem…" />
          <button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><CloseIcon /></button>
        </div>
        <div className="search-dialog__results">
          {query.trim().length < 2 && <div className="search-hint">Search Genesis → Revelation places, people, events, guided stories, dates, and Scripture references. Visionary material is discoverable through its stories and symbolic-place records.</div>}
          {query.trim().length >= 2 && results.length === 0 && <div className="search-hint">No result in the current Genesis → Revelation dataset.</div>}
          {results.map((result) => (
            <button className="search-result" key={`${result.kind}-${result.id}`} onClick={() => {
              if (result.kind === 'place') selectPlace(String(result.id));
              if (result.kind === 'person') selectPerson(String(result.id));
              if (result.kind === 'event') selectEvent(String(result.id));
              if (result.kind === 'story') openStory(String(result.id), 0);
              setSearchOpen(false); setQuery('');
            }}>
              <span className="search-result__kind">{String(result.kind)}</span>
              <strong>{String(result.name)}</strong>
              <small>{String(result.summary)}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
