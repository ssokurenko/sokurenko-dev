import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  cheatsheetSchema,
  parseYouTubeId,
  formatVideoDuration,
  videoMinutes,
  isStale,
  hasTopicVersion,
  formatVerificationAge,
} from '../src/config/cheatsheet-schema.ts';
import { STALENESS_WARNING_DAYS } from '../src/config/limits.ts';

const ID = 'tcUBahvsf7Y';

describe('hasTopicVersion', () => {
  it.each([
    '1.0',
    'v5.9',
    '.NET 9',
    'ES2026',
    'GraphQL Spec',
  ])('returns true for valid version %s', (version) => {
    expect(hasTopicVersion(version)).toBe(true);
  });

  it.each([
    undefined,
    '',
    'n/a',
    'na',
    'none',
    'not applicable',
    '-',
    '—',
    'tbd',
    '  N/A  ',
    ' NA ',
    ' NONE ',
    ' TBD ',
  ])('returns false for ignored value %j', (version) => {
    expect(hasTopicVersion(version)).toBe(false);
  });
});

describe('parseYouTubeId', () => {
  it.each([
    ID,
    `  ${ID}  `,
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://www.youtube.com/watch?list=PL123&v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}?rel=0`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
  ])('accepts %s', (input) => {
    expect(parseYouTubeId(input)).toBe(ID);
  });

  it.each([
    '',
    'tcUBahvsf7', // 10 chars
    'tcUBahvsf7Yx', // 12 chars
    'tcUBahvs!7Y',
    'https://www.youtube.com/watch',
    `https://vimeo.com/watch?v=${ID}`,
    `https://youtube.com.evil.example/watch?v=${ID}`,
    `https://www.youtube.com/@ssokurenko`,
    `https://www.youtube.com/playlist?list=PL123`,
    'not a url',
  ])('rejects %s', (input) => {
    expect(parseYouTubeId(input)).toBeNull();
  });
});

describe('isStale', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false for a recent date', () => {
    // 10 days ago
    const lastVerified = new Date('2023-12-22T12:00:00Z');
    expect(isStale(lastVerified)).toBe(false);
  });

  it('returns false for exactly the staleness limit', () => {
    const lastVerified = new Date('2024-01-01T12:00:00Z');
    lastVerified.setUTCDate(lastVerified.getUTCDate() - STALENESS_WARNING_DAYS);
    expect(isStale(lastVerified)).toBe(false);
  });

  it('returns true for a date older than the staleness limit', () => {
    const lastVerified = new Date('2024-01-01T12:00:00Z');
    lastVerified.setUTCDate(lastVerified.getUTCDate() - STALENESS_WARNING_DAYS - 1);
    expect(isStale(lastVerified)).toBe(true);
  });

  it('returns false for a future date', () => {
    const lastVerified = new Date('2024-01-02T12:00:00Z');
    expect(isStale(lastVerified)).toBe(false);
  });
});

describe('formatVideoDuration', () => {
  it.each([
    ['0:20', 1, '1 min'],
    ['0:40', 1, '1 min'],
    ['4:31', 5, '5 min'],
    ['12:05', 12, '12 min'],
    ['1:02:03', 62, '62 min'],
  ])('%s → %s', (duration, minutes, label) => {
    expect(videoMinutes(duration)).toBe(minutes);
    expect(formatVideoDuration(duration)).toBe(label);
  });
});

describe('formatVerificationAge', () => {
  it.each([
    [0, '0 days'],
    [1, '1 days'],
    [30, '30 days'],
    [59, '59 days'],
    [60, '2 months'],
    [61, '2 months'],
    [365, '12 months'],
    [700, '23 months'],
    [730, '2 years'],
    [731, '2 years'],
    [1095, '3 years'],
  ])('%s days → %s', (days, expected) => {
    expect(formatVerificationAge(days)).toBe(expected);
  });
});

describe('cheatsheet.video schema', () => {
  const base = {
    slug: 'api-concepts',
    section: 'foundations',
    summary: 'A summary.',
    topicVersion: 'N/A',
    verifiedAgainst: [{ label: 'RFC 9110', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' }],
    lastVerified: '2026-08-02',
    difficulty: 'beginner',
    tags: ['api'],
  };
  const parse = (video: unknown) => cheatsheetSchema.safeParse({ cheatsheet: { ...base, video } });

  it('is optional', () => {
    const result = cheatsheetSchema.safeParse({ cheatsheet: base });
    expect(result.success).toBe(true);
    expect(result.data?.cheatsheet?.video).toBeUndefined();
  });

  it('normalizes a pasted URL to the bare ID', () => {
    const result = parse({ youtube: `https://youtu.be/${ID}?si=x`, title: 'API Design', duration: '4:31' });
    expect(result.success).toBe(true);
    expect(result.data?.cheatsheet?.video?.youtube).toBe(ID);
  });

  it('rejects a non-YouTube value', () => {
    const result = parse({ youtube: 'https://vimeo.com/123', title: 'API Design', duration: '4:31' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['cheatsheet', 'video', 'youtube']);
  });

  it('requires a title', () => {
    expect(parse({ youtube: ID, duration: '4:31' }).success).toBe(false);
    expect(parse({ youtube: ID, title: '', duration: '4:31' }).success).toBe(false);
    expect(parse({ youtube: ID, title: 'x'.repeat(101), duration: '4:31' }).success).toBe(false);
  });

  it.each(['4:3', '4:61', '271', 'PT4M31S', '1:2:03', ''])('rejects duration %j', (duration) => {
    expect(parse({ youtube: ID, title: 'API Design', duration }).success).toBe(false);
  });
});
