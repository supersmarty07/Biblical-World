import { describe, expect, it } from 'vitest';
import { StaticSearchEngine, type SearchDocument } from './search';

const docs: SearchDocument[] = [
  { id: 'jerusalem', kind: 'place', name: 'Jerusalem', summary: 'Ancient city', aliases: 'Yerushalayim', scripture: 'Matthew 21 Acts 2', date: '' },
  { id: 'jesus', kind: 'person', name: 'Jesus', summary: 'Central figure of the Gospels', aliases: 'Jesus of Nazareth', scripture: 'Matthew 1 John 1', date: '' },
  { id: 'sennacherib-701', kind: 'event', name: 'Sennacherib campaigns in Judah', summary: 'Assyrian campaign', aliases: '', scripture: '2 Kings 18 Isaiah 36', date: '701 BCE' },
  { id: 'revelation-seven-churches', kind: 'story', name: 'The Seven Churches', summary: 'Roman Asia', aliases: 'Ephesus Smyrna Pergamum Thyatira Sardis Philadelphia Laodicea', scripture: 'Revelation 2 Revelation 3', date: '95 CE AD' }
];

const engine = new StaticSearchEngine(docs);

describe('StaticSearchEngine', () => {
  it('strongly ranks exact names', () => {
    expect(engine.search('Jerusalem')[0]?.id).toBe('jerusalem');
  });

  it('supports prefixes and aliases', () => {
    expect(engine.search('Yerush')[0]?.id).toBe('jerusalem');
  });

  it('supports a small typo tolerance', () => {
    expect(engine.search('Jeruslaem')[0]?.id).toBe('jerusalem');
  });

  it('searches Scripture references', () => {
    expect(engine.search('Isaiah 36')[0]?.id).toBe('sennacherib-701');
  });

  it('searches historical dates', () => {
    expect(engine.search('701 BCE')[0]?.id).toBe('sennacherib-701');
  });

  it('requires every query token to match the same document', () => {
    expect(engine.search('Revelation Laodicea')[0]?.id).toBe('revelation-seven-churches');
  });
});
