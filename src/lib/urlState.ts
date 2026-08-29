export interface UrlState {
  year?: number;
  place?: string;
  person?: string;
  event?: string;
  story?: string;
  chapter?: number;
  journey?: string;
  segment?: number;
  scene?: string;
  variant?: string;
  period?: string;
}

export function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);
  const year = Number(params.get('year'));
  const chapter = Number(params.get('chapter'));
  const segment = Number(params.get('segment'));

  return {
    year: Number.isFinite(year) && params.has('year') ? year : undefined,
    place: params.get('place') || undefined,
    person: params.get('person') || undefined,
    event: params.get('event') || undefined,
    story: params.get('story') || undefined,
    chapter: Number.isFinite(chapter) && params.has('chapter') ? chapter : undefined,
    journey: params.get('journey') || undefined,
    segment: Number.isFinite(segment) && params.has('segment') ? segment : undefined,
    scene: params.get('scene') || undefined,
    variant: params.get('variant') || undefined,
    period: params.get('period') || undefined
  };
}

export function writeUrlState(state: UrlState): void {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const write = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
    else params.delete(key);
  };
  write('year', state.year);
  write('place', state.place);
  write('person', state.person);
  write('event', state.event);
  write('story', state.story);
  write('chapter', state.chapter);
  write('journey', state.journey);
  write('segment', state.segment);
  write('scene', state.scene);
  write('variant', state.variant);
  write('period', state.period);
  window.history.replaceState({}, '', url);
}
