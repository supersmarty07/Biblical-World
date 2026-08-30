import { create } from 'zustand';
import type { AtlasData } from '../types/domain';
import type { ImmersiveScene, ImmersiveSceneCatalogEntry } from '../types/immersive';
import type { RuntimeAssetHealth, RuntimeAssetHealthMap, RuntimeAssetKey } from '../types/runtimeAssets';
import { readUrlState, writeUrlState } from '../lib/urlState';

const initialUrl = typeof window !== 'undefined' ? readUrlState() : {};
const defaultInfoOpen = typeof window !== 'undefined' && window.innerWidth > 900;
const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 860;
const hasInitialDeepLink = Boolean(initialUrl.scene || initialUrl.place || initialUrl.person || initialUrl.event || initialUrl.story || initialUrl.journey);

interface LayerVisibility {
  places: boolean;
  journeys: boolean;
  regions: boolean;
  roads: boolean;
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
  activeJourneyId?: string;
  activeJourneySegment: number;
  infoMode: 'stories' | 'journeys';
  searchOpen: boolean;
  infoOpen: boolean;
  attributionOpen: boolean;
  immersiveExploreOpen: boolean;
  mobileLayersOpen: boolean;
  layers: LayerVisibility;
  runtimeAssets: RuntimeAssetHealthMap;
  sceneCatalog: ImmersiveSceneCatalogEntry[];
  sceneError?: string;
  activeSceneId?: string;
  activeScene?: ImmersiveScene;
  activeHotspotId?: string;
  activeSceneVariantId?: string;
  activeScenePeriodId?: string;
  setData: (data: AtlasData) => void;
  setError: (error: string) => void;
  setYear: (year: number) => void;
  selectPlace: (id?: string) => void;
  selectPerson: (id?: string) => void;
  selectEvent: (id?: string) => void;
  openStory: (id?: string, chapter?: number) => void;
  setChapter: (chapter: number) => void;
  openJourney: (id?: string, segment?: number) => void;
  setJourneySegment: (segment: number) => void;
  setInfoMode: (mode: 'stories' | 'journeys') => void;
  setSearchOpen: (open: boolean) => void;
  setInfoOpen: (open: boolean) => void;
  setAttributionOpen: (open: boolean) => void;
  setImmersiveExploreOpen: (open: boolean) => void;
  setMobileLayersOpen: (open: boolean) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setRuntimeAssetHealth: (key: RuntimeAssetKey, health: RuntimeAssetHealth) => void;
  setSceneCatalog: (sceneCatalog: ImmersiveSceneCatalogEntry[]) => void;
  setSceneError: (sceneError?: string) => void;
  openScene: (id?: string) => void;
  setActiveScene: (activeScene?: ImmersiveScene) => void;
  setActiveHotspot: (id?: string) => void;
  setActiveSceneVariant: (id?: string) => void;
  setActiveScenePeriod: (id?: string) => void;
}

function sync(partial: { year?: number; place?: string; person?: string; event?: string; story?: string; chapter?: number; journey?: string; segment?: number; scene?: string; variant?: string; period?: string }) {
  const current = readUrlState();
  writeUrlState({ ...current, ...partial });
}

function hasSelection(state: Pick<AtlasStore, 'selectedPlaceId' | 'selectedPersonId' | 'selectedEventId' | 'activeStoryId' | 'activeJourneyId'>): boolean {
  return Boolean(state.selectedPlaceId || state.selectedPersonId || state.selectedEventId || state.activeStoryId || state.activeJourneyId);
}

export const useAtlasStore = create<AtlasStore>((set) => ({
  loading: true,
  year: initialUrl.year ?? -850,
  selectedPlaceId: initialUrl.place,
  selectedPersonId: initialUrl.person,
  selectedEventId: initialUrl.event,
  activeStoryId: initialUrl.story,
  activeChapter: initialUrl.chapter ?? 0,
  activeJourneyId: initialUrl.journey,
  activeJourneySegment: initialUrl.segment ?? 0,
  infoMode: initialUrl.journey ? 'journeys' : 'stories',
  searchOpen: false,
  infoOpen: !initialUrl.scene && (Boolean(initialUrl.place || initialUrl.person || initialUrl.event || initialUrl.story || initialUrl.journey) || defaultInfoOpen),
  attributionOpen: false,
  immersiveExploreOpen: isMobileViewport && !hasInitialDeepLink,
  mobileLayersOpen: false,
  layers: { places: true, journeys: !isMobileViewport, regions: !isMobileViewport, roads: false, terrain: false },
  runtimeAssets: {
    terrain: { state: 'not-configured', message: 'No terrain source has been checked yet.' },
    basemap: { state: 'not-configured', message: 'No external basemap has been checked yet.' },
    'roman-roads': { state: 'not-configured', message: 'No Roman-road source has been checked yet.' }
  },
  sceneCatalog: [],
  activeSceneId: initialUrl.scene,
  activeSceneVariantId: initialUrl.variant,
  activeScenePeriodId: initialUrl.period,
  setData: (data) => set({ data, loading: false }),
  setError: (error) => set({ error, loading: false }),
  setYear: (year) => { sync({ year }); set({ year }); },
  selectPlace: (selectedPlaceId) => {
    sync({ place: selectedPlaceId, person: undefined, event: undefined, story: undefined, chapter: undefined, journey: undefined, segment: undefined, scene: undefined, variant: undefined, period: undefined });
    set({ selectedPlaceId, selectedPersonId: undefined, selectedEventId: undefined, activeStoryId: undefined, activeChapter: 0, activeJourneyId: undefined, activeJourneySegment: 0, activeSceneId: undefined, activeScene: undefined, activeHotspotId: undefined, activeSceneVariantId: undefined, activeScenePeriodId: undefined, immersiveExploreOpen: false, mobileLayersOpen: false, infoOpen: Boolean(selectedPlaceId) });
  },
  selectPerson: (selectedPersonId) => {
    sync({ person: selectedPersonId, place: undefined, event: undefined, story: undefined, chapter: undefined, journey: undefined, segment: undefined, scene: undefined, variant: undefined, period: undefined });
    set({ selectedPersonId, selectedPlaceId: undefined, selectedEventId: undefined, activeStoryId: undefined, activeChapter: 0, activeJourneyId: undefined, activeJourneySegment: 0, activeSceneId: undefined, activeScene: undefined, activeHotspotId: undefined, activeSceneVariantId: undefined, activeScenePeriodId: undefined, immersiveExploreOpen: false, mobileLayersOpen: false, infoOpen: Boolean(selectedPersonId) });
  },
  selectEvent: (selectedEventId) => {
    sync({ event: selectedEventId, place: undefined, person: undefined, story: undefined, chapter: undefined, journey: undefined, segment: undefined, scene: undefined, variant: undefined, period: undefined });
    set({ selectedEventId, selectedPlaceId: undefined, selectedPersonId: undefined, activeStoryId: undefined, activeChapter: 0, activeJourneyId: undefined, activeJourneySegment: 0, activeSceneId: undefined, activeScene: undefined, activeHotspotId: undefined, activeSceneVariantId: undefined, activeScenePeriodId: undefined, immersiveExploreOpen: false, mobileLayersOpen: false, infoOpen: Boolean(selectedEventId) });
  },
  openStory: (activeStoryId, chapter = 0) => {
    sync({ story: activeStoryId, chapter: activeStoryId ? chapter : undefined, journey: undefined, segment: undefined, place: undefined, person: undefined, event: undefined, scene: undefined, variant: undefined, period: undefined });
    set({ activeStoryId, activeChapter: chapter, activeJourneyId: undefined, activeJourneySegment: 0, infoMode: 'stories', selectedPlaceId: undefined, selectedPersonId: undefined, selectedEventId: undefined, activeSceneId: undefined, activeScene: undefined, activeHotspotId: undefined, activeSceneVariantId: undefined, activeScenePeriodId: undefined, immersiveExploreOpen: false, mobileLayersOpen: false, infoOpen: Boolean(activeStoryId) });
  },
  setChapter: (activeChapter) => { sync({ chapter: activeChapter }); set({ activeChapter }); },
  openJourney: (activeJourneyId, segment = 0) => {
    sync({ journey: activeJourneyId, segment: activeJourneyId ? segment : undefined, story: undefined, chapter: undefined, place: undefined, person: undefined, event: undefined, scene: undefined, variant: undefined, period: undefined });
    set({ activeJourneyId, activeJourneySegment: segment, infoMode: 'journeys', activeStoryId: undefined, activeChapter: 0, selectedPlaceId: undefined, selectedPersonId: undefined, selectedEventId: undefined, activeSceneId: undefined, activeScene: undefined, activeHotspotId: undefined, activeSceneVariantId: undefined, activeScenePeriodId: undefined, immersiveExploreOpen: false, mobileLayersOpen: false, infoOpen: true });
  },
  setJourneySegment: (activeJourneySegment) => { sync({ segment: activeJourneySegment }); set({ activeJourneySegment }); },
  setInfoMode: (infoMode) => set({ infoMode }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setInfoOpen: (infoOpen) => set({ infoOpen }),
  setAttributionOpen: (attributionOpen) => set({ attributionOpen }),
  setImmersiveExploreOpen: (immersiveExploreOpen) => set((state) => ({
    ...state,
    immersiveExploreOpen,
    ...(immersiveExploreOpen ? { mobileLayersOpen: false, infoOpen: false } : {})
  })),
  setMobileLayersOpen: (mobileLayersOpen) => set((state) => ({
    ...state,
    mobileLayersOpen,
    ...(mobileLayersOpen ? { immersiveExploreOpen: false } : {})
  })),
  toggleLayer: (layer) => set((state) => ({ layers: { ...state.layers, [layer]: !state.layers[layer] } })),
  setRuntimeAssetHealth: (key, health) => set((state) => ({ runtimeAssets: { ...state.runtimeAssets, [key]: health } })),
  setSceneCatalog: (sceneCatalog) => set({ sceneCatalog }),
  setSceneError: (sceneError) => set({ sceneError }),
  openScene: (activeSceneId) => {
    sync({ scene: activeSceneId, variant: undefined, period: undefined });
    set((state) => ({
      activeSceneId,
      activeScene: undefined,
      activeHotspotId: undefined,
      activeSceneVariantId: undefined,
      activeScenePeriodId: undefined,
      immersiveExploreOpen: false,
      mobileLayersOpen: false,
      infoOpen: activeSceneId ? false : hasSelection(state)
    }));
  },
  setActiveScene: (activeScene) => set({ activeScene }),
  setActiveHotspot: (activeHotspotId) => set({ activeHotspotId }),
  setActiveSceneVariant: (activeSceneVariantId) => { sync({ variant: activeSceneVariantId }); set({ activeSceneVariantId, activeHotspotId: undefined }); },
  setActiveScenePeriod: (activeScenePeriodId) => { sync({ period: activeScenePeriodId }); set({ activeScenePeriodId, activeHotspotId: undefined }); }
}));
