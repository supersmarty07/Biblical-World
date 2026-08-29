import { create } from 'zustand';
import type { AtlasData } from '../types/domain';
import { readUrlState, writeUrlState } from '../lib/urlState';

const initialUrl = typeof window !== 'undefined' ? readUrlState() : {};
const defaultInfoOpen = typeof window !== 'undefined' && window.innerWidth > 900;

interface LayerVisibility {
  places: boolean;
  journeys: boolean;
  regions: boolean;
  terrain: boolean;
}

interface AtlasStore {
  data?: AtlasData;
  loading: boolean;
  error?: string;
  year: number;
  selectedPlaceId?: string;
  selectedPersonId?: string;
  selectedEventId?: string;
  activeStoryId?: string;
  activeChapter: number;
  searchOpen: boolean;
  infoOpen: boolean;
  layers: LayerVisibility;
  setData: (data: AtlasData) => void;
  setError: (error: string) => void;
  setYear: (year: number) => void;
  selectPlace: (id?: string) => void;
  selectPerson: (id?: string) => void;
  selectEvent: (id?: string) => void;
  openStory: (id?: string, chapter?: number) => void;
  setChapter: (chapter: number) => void;
  setSearchOpen: (open: boolean) => void;
  setInfoOpen: (open: boolean) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
}

function sync(partial: { year?: number; place?: string; person?: string; event?: string; story?: string; chapter?: number }) {
  const current = readUrlState();
  writeUrlState({ ...current, ...partial });
}

export const useAtlasStore = create<AtlasStore>((set) => ({
  loading: true,
  year: initialUrl.year ?? -850,
  selectedPlaceId: initialUrl.place,
  selectedPersonId: initialUrl.person,
  selectedEventId: initialUrl.event,
  activeStoryId: initialUrl.story,
  activeChapter: initialUrl.chapter ?? 0,
  searchOpen: false,
  infoOpen: Boolean(initialUrl.place || initialUrl.person || initialUrl.event || initialUrl.story) || defaultInfoOpen,
  layers: { places: true, journeys: true, regions: true, terrain: false },
  setData: (data) => set({ data, loading: false }),
  setError: (error) => set({ error, loading: false }),
  setYear: (year) => { sync({ year }); set({ year }); },
  selectPlace: (selectedPlaceId) => {
    sync({ place: selectedPlaceId, person: undefined, event: undefined, story: undefined, chapter: undefined });
    set({ selectedPlaceId, selectedPersonId: undefined, selectedEventId: undefined, activeStoryId: undefined, activeChapter: 0, infoOpen: Boolean(selectedPlaceId) });
  },
  selectPerson: (selectedPersonId) => {
    sync({ person: selectedPersonId, place: undefined, event: undefined, story: undefined, chapter: undefined });
    set({ selectedPersonId, selectedPlaceId: undefined, selectedEventId: undefined, activeStoryId: undefined, activeChapter: 0, infoOpen: Boolean(selectedPersonId) });
  },
  selectEvent: (selectedEventId) => {
    sync({ event: selectedEventId, place: undefined, person: undefined, story: undefined, chapter: undefined });
    set({ selectedEventId, selectedPlaceId: undefined, selectedPersonId: undefined, activeStoryId: undefined, activeChapter: 0, infoOpen: Boolean(selectedEventId) });
  },
  openStory: (activeStoryId, chapter = 0) => {
    sync({ story: activeStoryId, chapter: activeStoryId ? chapter : undefined, place: undefined, person: undefined, event: undefined });
    set({ activeStoryId, activeChapter: chapter, selectedPlaceId: undefined, selectedPersonId: undefined, selectedEventId: undefined, infoOpen: Boolean(activeStoryId) });
  },
  setChapter: (activeChapter) => { sync({ chapter: activeChapter }); set({ activeChapter }); },
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setInfoOpen: (infoOpen) => set({ infoOpen }),
  toggleLayer: (layer) => set((state) => ({ layers: { ...state.layers, [layer]: !state.layers[layer] } }))
}));
