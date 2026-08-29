import { useEffect } from 'react';
import { useAtlasStore } from '../state/useAtlasStore';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from './Icons';
import { CharacterPortrait } from './CharacterPortrait';
import type { BiblicalCharacter } from '../types/domain';
import { StoryArtwork } from './StoryArtwork';

function characterForStory(personId?: string): BiblicalCharacter {
  const supported: BiblicalCharacter[] = ['john-of-patmos', 'abraham', 'isaac', 'jacob', 'joseph', 'moses', 'joshua', 'deborah', 'gideon', 'samson', 'ruth', 'samuel', 'saul', 'david', 'absalom', 'solomon', 'rehoboam', 'jeroboam-i', 'shoshenq-i', 'omri', 'ahab', 'jezebel', 'elijah', 'elisha', 'jehu', 'amos', 'jonah', 'isaiah', 'hezekiah', 'sargon-ii', 'sennacherib', 'josiah', 'jeremiah', 'zedekiah', 'nebuchadnezzar-ii', 'ezekiel', 'daniel', 'cyrus-ii', 'zerubbabel', 'darius-i', 'esther', 'ezra', 'nehemiah', 'alexander-iii', 'antiochus-iv', 'mattathias', 'judas-maccabeus', 'jonathan-apphus', 'simon-thassi', 'john-hyrcanus-i', 'pompey', 'herod-great', 'augustus', 'jesus', 'john-baptist', 'peter', 'mary-magdalene', 'herod-antipas', 'pontius-pilate', 'caiaphas', 'paul', 'stephen', 'philip-evangelist', 'barnabas', 'cornelius', 'silas', 'timothy', 'lydia', 'priscilla', 'aquila', 'felix', 'porcius-festus', 'herod-agrippa-ii', 'john-of-patmos'];
  return supported.includes(personId as BiblicalCharacter) ? personId as BiblicalCharacter : 'generic';
}

export function StoryPlayer() {
  const data = useAtlasStore((s) => s.data);
  const activeStoryId = useAtlasStore((s) => s.activeStoryId);
  const activeChapter = useAtlasStore((s) => s.activeChapter);
  const openStory = useAtlasStore((s) => s.openStory);
  const setChapter = useAtlasStore((s) => s.setChapter);
  const setYear = useAtlasStore((s) => s.setYear);
  const story = data?.stories.find((item) => item.id === activeStoryId);

  useEffect(() => {
    const chapter = story?.chapters[Math.min(activeChapter, Math.max(0, story.chapters.length - 1))];
    if (chapter?.contextYear !== undefined) setYear(chapter.contextYear);
  }, [activeChapter, setYear, story]);

  if (!data) return null;

  if (!story) {
    return (
      <section className="story-library">
        <span className="eyebrow">Genesis → Revelation · guided explorations</span>
        <h2>Choose a story</h2>
        <p>Each guided experience moves the map, links Scripture and ancient sources, and marks the difference between established geography, literary testimony, archaeology, and reconstruction.</p>
        <div className="story-library__grid">
          {data.stories.map((item) => (
            <button className="story-library__item" key={item.id} onClick={() => openStory(item.id, 0)}>
              <span>{item.theme || 'Genesis'}</span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const chapter = story.chapters[Math.min(activeChapter, story.chapters.length - 1)];
  const person = story.personId ? data.people.find((item) => item.id === story.personId) : undefined;
  const character = characterForStory(story.personId);

  return (
    <section className="story-card story-card--active">
      <StoryArtwork storyId={story.id} />
      <CharacterPortrait character={character} label={person?.name || story.title.replace(/ —.*/, '')} compact />
      <div className="story-card__progress">
        {story.chapters.map((item, index) => <span key={item.id} className={index <= activeChapter ? 'is-active' : ''} />)}
      </div>
      <span className="eyebrow">{chapter.eyebrow}</span>
      <h2>{chapter.title}</h2>
      <p>{chapter.description}</p>
      {chapter.scripture.length > 0 && (
        <div className="scripture-chips">
          {chapter.scripture.map((ref) => <span key={ref.label}>{ref.label}</span>)}
        </div>
      )}
      {chapter.visionarySceneId && <div className="evidence-banner">Visionary mode active: this chapter is rendered outside ordinary terrestrial map geography.</div>}
      {chapter.textualReferences && chapter.textualReferences.length > 0 && (
        <div className="scripture-chips scripture-chips--ancient" aria-label="Ancient textual references">
          {chapter.textualReferences.map((ref) => <span key={`${ref.sourceId}:${ref.label}`}>{ref.label} · {ref.kind.replaceAll('-', ' ')}</span>)}
        </div>
      )}
      <div className="story-card__nav">
        <button className="icon-button" onClick={() => setChapter(Math.max(0, activeChapter - 1))} disabled={activeChapter === 0} aria-label="Previous story chapter"><ChevronLeftIcon /></button>
        <span>{activeChapter + 1} / {story.chapters.length}</span>
        <button className="icon-button" onClick={() => setChapter(Math.min(story.chapters.length - 1, activeChapter + 1))} disabled={activeChapter === story.chapters.length - 1} aria-label="Next story chapter"><ChevronRightIcon /></button>
      </div>
      <button className="text-button" onClick={() => openStory(undefined)}>Back to guided stories</button>
      {!activeStoryId && <button className="primary-button"><PlayIcon /> Begin story</button>}
    </section>
  );
}
