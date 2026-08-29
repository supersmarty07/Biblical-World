interface StoryArtworkProps {
  storyId: string;
}

type StoryTheme = 'egypt' | 'sinai' | 'joshua' | 'judges' | 'genesis' | 'ruth' | 'monarchy' | 'jerusalem' | 'solomon' | 'divided' | 'prophet' | 'assyria' | 'exile' | 'babylon' | 'persia' | 'restoration' | 'hellenistic' | 'maccabee' | 'roman' | 'herodian' | 'gospel' | 'galilee' | 'passion' | 'acts' | 'mission' | 'voyage' | 'revelation';

function themeForStory(storyId: string): StoryTheme {
  if (storyId.startsWith('story-patmos') || storyId.startsWith('story-seven-churches') || storyId.startsWith('story-throne') || storyId.startsWith('story-woman') || storyId.startsWith('story-babylon') || storyId.startsWith('story-new-creation') || storyId === 'story-genesis-to-revelation') return 'revelation';
  if (['story-pentecost-jerusalem', 'story-stephen-philip', 'story-peter-caesarea-agrippa', 'story-antioch-council', 'story-jerusalem-arrest', 'story-caesarea-trials'].includes(storyId)) return 'acts';
  if (['story-saul-to-antioch', 'story-first-mission', 'story-second-mission-macedonia', 'story-athens-corinth', 'story-ephesus-third-journey', 'story-pauline-network'].includes(storyId)) return 'mission';
  if (storyId === 'story-voyage-rome') return 'voyage';
  if (['story-infancy-gospels', 'story-john-baptist'].includes(storyId)) return 'gospel';
  if (['story-galilee-beginnings', 'story-sea-galilee', 'story-samaria-sychar', 'story-northern-ministry', 'story-final-journey'].includes(storyId)) return 'galilee';
  if (['story-first-century-jerusalem', 'story-final-week-gospels', 'story-pilate-trial', 'story-crucifixion-burial', 'story-resurrection-geography'].includes(storyId)) return 'passion';
  if (['story-alexander-hellenistic', 'story-ptolemaic-judea', 'story-seleucid-takeover'].includes(storyId)) return 'hellenistic';
  if (['story-antiochus-crisis', 'story-maccabean-revolt', 'story-hasmonean-state', 'story-second-temple-diversity'].includes(storyId)) return 'maccabee';
  if (storyId === 'story-rome-enters-judea') return 'roman';
  if (['story-herod-transition', 'story-nabataea-idumea'].includes(storyId)) return 'herodian';
  if (['story-late-prophets', 'story-josiah-last-judah', 'story-jeremiah-fall', 'story-babylonian-exile', 'story-ezekiel-exile'].includes(storyId)) return 'exile';
  if (storyId === 'story-daniel-imperial-world') return 'babylon';
  if (['story-cyrus-return', 'story-esther-susa', 'story-nehemiah'].includes(storyId)) return 'persia';
  if (['story-temple-restoration', 'story-ezra'].includes(storyId)) return 'restoration';
  if (storyId === 'story-division' || storyId === 'story-omri-ahab' || storyId === 'story-jehu') return 'divided';
  if (['story-elijah', 'story-elisha', 'story-amos-hosea', 'story-jonah-geography'].includes(storyId)) return 'prophet';
  if (['story-assyria-samaria', 'story-sennacherib-701'].includes(storyId)) return 'assyria';
  if (storyId === 'story-isaiah-hezekiah') return 'jerusalem';
  if (storyId === 'story-exodus') return 'egypt';
  if (storyId === 'story-sinai-wilderness' || storyId === 'story-transjordan') return 'sinai';
  if (storyId.startsWith('story-joshua')) return 'joshua';
  if (['story-deborah', 'story-gideon', 'story-jephthah', 'story-samson', 'story-early-judges', 'story-danite-migration', 'story-end-judges'].includes(storyId)) return 'judges';
  if (storyId === 'story-ruth') return 'ruth';
  if (storyId === 'story-jerusalem-zion' || storyId === 'story-solomon-temple') return 'jerusalem';
  if (storyId === 'story-solomon-world') return 'solomon';
  if (['story-samuel-ark', 'story-saul', 'story-david-elah', 'story-david-fugitive', 'story-david-jerusalem', 'story-absalom'].includes(storyId)) return 'monarchy';
  return 'genesis';
}

export function StoryArtwork({ storyId }: StoryArtworkProps) {
  const theme = themeForStory(storyId);
  return (
    <figure className={`story-art story-art--${theme}`} aria-label="Artistic historical landscape context; not an archaeological reconstruction">
      <svg viewBox="0 0 520 190" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`sky-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="story-art__sky-a" />
            <stop offset="1" className="story-art__sky-b" />
          </linearGradient>
        </defs>
        <rect width="520" height="190" fill={`url(#sky-${theme})`} />
        <circle className="story-art__sun" cx="418" cy="46" r="26" />

        {theme === 'egypt' && <>
          <path className="story-art__far" d="M0 105c72-10 122-8 175 0 77 12 141 7 211-5 51-9 93-7 134 4v86H0Z" />
          <path className="story-art__water" d="M0 139c83-9 140 7 216 2 92-7 160-15 304-2v51H0Z" />
          <g className="story-art__architecture" transform="translate(64 78)"><path d="M0 48h96V32H80V8H66v24H30V11H16v21H0Z" /><path d="M10 30 25 0l15 30M57 30 73 0l15 30" /></g>
          <path className="story-art__reeds" d="M311 146v-39m9 39v-51m11 52v-44m8 44v-56m11 58v-47" />
        </>}

        {theme === 'sinai' && <>
          <path className="story-art__far" d="m0 134 75-65 50 37 69-72 80 90 54-54 71 55 54-30 67 45v50H0Z" />
          <path className="story-art__near" d="m0 153 92-45 65 34 78-27 82 34 76-38 127 43v36H0Z" />
          <g className="story-art__camp" transform="translate(92 135)"><path d="m0 18 18-18 18 18Zm52 0L70 1l18 17Zm54 0 17-16 18 16Z" /></g>
        </>}

        {theme === 'joshua' && <>
          <path className="story-art__far" d="M0 122 68 93l54 22 78-61 58 58 79-44 70 46 62-30 51 32v74H0Z" />
          <path className="story-art__water" d="M0 148c90-19 134 7 213 4 98-4 166-19 307-3v41H0Z" />
          <g className="story-art__walls" transform="translate(352 95)"><path d="M0 52V15h18V0h15v15h22V5h15v10h22v37Z" /><path d="M10 52V31h15v21m34 0V29h16v23" /></g>
        </>}

        {theme === 'judges' && <>
          <path className="story-art__far" d="M0 120c57-25 96-31 144-15 47 16 71-43 124-36 48 6 80 46 122 39 52-9 78-9 130 18v64H0Z" />
          <path className="story-art__near" d="M0 152c74-17 116-12 172 2 73 19 149-13 213-11 60 2 93 8 135 20v27H0Z" />
          <g className="story-art__chariot" transform="translate(335 123)"><circle cx="15" cy="24" r="11" /><circle cx="64" cy="24" r="11" /><path d="M15 24h49M27 22l8-20h27l9 20M39 2l-5-16" /></g>
        </>}

        {theme === 'ruth' && <>
          <path className="story-art__far" d="M0 126c60-29 112-35 166-12 48 20 91-37 145-30 59 8 91 37 209 41v65H0Z" />
          <path className="story-art__near" d="M0 157c74-18 130-17 190-2 87 21 160-19 244-9 35 4 64 10 86 17v27H0Z" />
          <g className="story-art__grain" transform="translate(65 111)"><path d="M0 51V5m10 46V0m11 51V11m11 40V4m11 47V14M0 16l-8-7m18 10 8-8m3 15-8-8m19 2 8-7m3 19-8-8" /></g>
        </>}

        {theme === 'monarchy' && <>
          <path className="story-art__far" d="M0 128 61 95l55 17 68-45 62 47 74-54 73 53 54-24 73 43v58H0Z" />
          <path className="story-art__near" d="M0 155c76-20 129-13 194 0 68 14 126-22 192-14 63 8 96 14 134 26v23H0Z" />
          <g className="story-art__fort" transform="translate(350 98)"><path d="M0 51V17h15V5h16v12h23V0h16v17h22v34Z" /><path d="M37 51V30h17v21" /></g>
          <g className="story-art__spear-line" transform="translate(105 111)"><path d="M0 45 11 0m8 45L30 4m8 41L48 2" /></g>
        </>}

        {theme === 'jerusalem' && <>
          <path className="story-art__far" d="M0 126c67-22 109-20 161-9 52 12 88-42 143-34 54 8 73 36 122 30 35-4 63-2 94 14v63H0Z" />
          <path className="story-art__valley" d="M0 150c95-8 158 14 236 8 69-5 109-24 168-22 49 2 84 10 116 21v33H0Z" />
          <g className="story-art__jerusalem" transform="translate(300 83)"><path d="M0 72V39h19V25h19v14h18V12h19v27h20v33Z" /><path d="M17 25 37 11l19 14M48 12 66 0l17 12" /><path d="M8 72V55h15v17m45 0V51h15v21" /></g>
          <path className="story-art__water" d="M259 170c8-18 12-42 9-65" />
        </>}

        {theme === 'solomon' && <>
          <path className="story-art__far" d="M0 125c80-22 130-16 181-2 61 16 111-42 178-27 49 11 86 24 161 20v74H0Z" />
          <path className="story-art__water" d="M0 158c111-15 191 12 281 3 89-8 150-22 239-9v38H0Z" />
          <g className="story-art__ship" transform="translate(333 118)"><path d="M0 33h88L72 50H18Z" /><path d="M43 33V0m2 4 30 20H45Z" /></g>
          <g className="story-art__cedar" transform="translate(83 96)"><path d="M25 61V23M5 35h40L26 13Zm4-15h33L26 0Z" /></g>
        </>}

        {theme === 'genesis' && <>
          <path className="story-art__far" d="M0 124 68 95l52 19 84-59 64 55 69-33 67 42 53-23 63 34v60H0Z" />
          <path className="story-art__near" d="M0 158c83-19 134-15 200 1 93 23 150-25 237-10 37 6 62 11 83 17v24H0Z" />
          <g className="story-art__caravan" transform="translate(78 129)"><path d="M0 20c8-11 19-12 30-2 8-6 18-4 25 4l-4 9H6Z" /><circle cx="12" cy="34" r="4" /><circle cx="43" cy="34" r="4" /></g>
        </>}

        {theme === 'divided' && <>
          <path className="story-art__far" d="M0 126c70-28 120-24 174-8 58 17 86-38 147-31 59 7 90 39 199 28v75H0Z" />
          <path className="story-art__near" d="M0 158c82-20 135-13 206 3 84 19 145-20 226-10 35 4 63 10 88 18v21H0Z" />
          <g className="story-art__fort" transform="translate(336 95)"><path d="M0 55V23h18V8h17v15h22V1h17v22h22v32Z" /><path d="M37 55V35h19v20" /></g>
          <path className="story-art__border" d="M78 148c38-18 69-25 111-18 37 6 67 2 98-12" />
        </>}

        {theme === 'prophet' && <>
          <path className="story-art__far" d="M0 128 64 96l54 17 74-53 62 55 66-40 73 45 55-27 72 39v58H0Z" />
          <path className="story-art__near" d="M0 156c65-13 119-10 178 1 83 16 143-14 224-12 47 1 83 9 118 22v23H0Z" />
          <path className="story-art__water" d="M42 169c76-7 113-1 173 2 51 3 91-4 130-13" />
          <g className="story-art__altar" transform="translate(348 119)"><path d="M0 28h67l-9 18H8Z" /><path d="M17 26 33 5l16 21" /></g>
        </>}

        {theme === 'exile' && <>
          <path className="story-art__far" d="M0 128c64-20 116-18 174-2 59 16 93-32 153-26 55 5 89 29 193 20v70H0Z" />
          <path className="story-art__near" d="M0 162c85-18 141-12 207 1 82 16 150-19 226-8 38 5 66 13 87 22v13H0Z" />
          <g className="story-art__walls" transform="translate(342 98)"><path d="M0 56V25h18V9h16v16h22V4h16v21h20v31Z" /><path d="M0 56 19 43 38 56M56 56l18-14 18 14" /></g>
          <g className="story-art__caravan" transform="translate(78 130)"><path d="M0 20c8-11 19-12 30-2 8-6 18-4 25 4l-4 9H6Z" /><circle cx="12" cy="34" r="4" /><circle cx="43" cy="34" r="4" /></g>
        </>}

        {theme === 'babylon' && <>
          <path className="story-art__far" d="M0 129c77-18 137-18 198-3 61 15 113-31 175-22 54 8 87 24 147 18v68H0Z" />
          <path className="story-art__water" d="M0 160c85-8 151 7 227 3 87-5 164-19 293-7v34H0Z" />
          <g className="story-art__architecture" transform="translate(320 75)"><path d="M0 84V34h18V17h18v17h22V0h20v34h20v50Z" /><path d="M14 84V52h22v32m26 0V48h20v36" /></g>
          <path className="story-art__reeds" d="M86 160v-44m11 44v-54m11 54v-38m10 39v-50" />
        </>}

        {theme === 'persia' && <>
          <path className="story-art__far" d="M0 126 72 92l57 22 83-58 66 57 74-43 70 45 51-22 47 30v67H0Z" />
          <path className="story-art__near" d="M0 160c72-16 132-11 196 3 79 17 150-21 224-12 42 5 76 13 100 24v15H0Z" />
          <g className="story-art__architecture" transform="translate(337 96)"><path d="M0 54h91V41H78V18H66v23H25V21H13v20H0Z" /><path d="M11 18 25 5l14 13m24 0L77 5l13 13" /></g>
        </>}

        {theme === 'restoration' && <>
          <path className="story-art__far" d="M0 128c68-20 115-19 169-7 57 13 89-35 146-28 54 7 88 34 205 26v71H0Z" />
          <path className="story-art__near" d="M0 160c83-19 141-12 207 3 75 17 146-21 225-10 39 5 66 12 88 21v16H0Z" />
          <g className="story-art__jerusalem" transform="translate(314 87)"><path d="M0 67V39h18V27h18v12h19V14h18v25h20v28Z" /><path d="M16 27 36 14l19 13M47 14 64 2l17 12" /></g>
          <g className="story-art__grain" transform="translate(71 120)"><path d="M0 41V5m10 36V0m11 41V11m11 30V4m11 37V14" /></g>
        </>}


        {theme === 'hellenistic' && <>
          <path className="story-art__far" d="M0 128c74-20 129-14 188 0 58 14 103-38 162-29 56 8 92 34 170 23v68H0Z" />
          <path className="story-art__water" d="M0 159c94-12 157 10 242 3 88-7 162-17 278-5v33H0Z" />
          <g className="story-art__columns" transform="translate(340 92)"><path d="M0 58h92M12 58V15m20 43V15m20 43V15m20 43V15M4 15h78L72 4H14Z" /></g>
          <g className="story-art__ship" transform="translate(92 127)"><path d="M0 28h74L60 42H13Z" /><path d="M36 28V0m2 4 27 18H38Z" /></g>
        </>}

        {theme === 'maccabee' && <>
          <path className="story-art__far" d="M0 126 66 96l54 16 72-48 59 50 77-47 70 49 56-24 66 38v60H0Z" />
          <path className="story-art__near" d="M0 158c76-18 135-12 203 3 77 16 141-22 223-11 40 5 70 12 94 22v18H0Z" />
          <g className="story-art__fort" transform="translate(344 95)"><path d="M0 56V22h17V8h16v14h22V0h17v22h22v34Z" /><path d="M36 56V34h19v22" /></g>
          <g className="story-art__spear-line" transform="translate(92 112)"><path d="M0 45 10 0m12 45L31 4m12 41L53 1m11 44L73 6" /></g>
        </>}

        {theme === 'roman' && <>
          <path className="story-art__far" d="M0 126c72-22 124-18 183-3 61 16 100-37 160-28 60 9 92 35 177 24v71H0Z" />
          <path className="story-art__near" d="M0 160c82-18 144-11 210 3 78 17 148-22 226-10 38 6 65 13 84 22v15H0Z" />
          <g className="story-art__roman" transform="translate(335 96)"><path d="M0 58h96V46H84V15H72v31H24V15H12v31H0Z" /><path d="M7 15h82L78 3H18Z" /></g>
          <g className="story-art__standards" transform="translate(95 111)"><path d="M0 46V0m20 46V5m20 41V1M-5 10h10m10 7h10m10-6h10" /></g>
        </>}

        {theme === 'herodian' && <>
          <path className="story-art__far" d="M0 127c70-22 120-19 176-5 59 15 95-38 154-30 57 7 90 33 190 25v73H0Z" />
          <path className="story-art__water" d="M0 163c92-11 157 6 237 3 92-4 170-18 283-6v30H0Z" />
          <g className="story-art__harbor" transform="translate(326 95)"><path d="M0 58h98V43H84V18H67v25H28V25H13v18H0Z" /><path d="M5 58c18-15 39-18 58-8 10 5 21 6 35 2" /></g>
          <g className="story-art__caravan" transform="translate(82 130)"><path d="M0 20c8-11 19-12 30-2 8-6 18-4 25 4l-4 9H6Z" /><circle cx="12" cy="34" r="4" /><circle cx="43" cy="34" r="4" /></g>
        </>}

        {theme === 'gospel' && <>
          <path className="story-art__far" d="M0 127c68-25 119-25 177-7 59 18 93-39 153-31 56 7 91 36 190 27v74H0Z" />
          <path className="story-art__near" d="M0 160c82-19 141-12 210 2 75 16 143-19 220-10 43 5 72 13 90 23v15H0Z" />
          <g className="story-art__village" transform="translate(335 109)"><path d="M0 43V20l17-13 18 13v23Zm42 0V15L58 4l17 11v28Zm-31 0V30h11v13m42 0V29h10v14" /></g>
          <g className="story-art__olive" transform="translate(90 105)"><path d="M20 55V18M20 28 3 12m18 8L38 5M8 17l-6-6m30 1 8-7" /><circle cx="3" cy="10" r="6"/><circle cx="39" cy="5" r="6"/><circle cx="8" cy="17" r="5"/></g>
        </>}

        {theme === 'galilee' && <>
          <path className="story-art__far" d="M0 118c72-31 121-28 174-9 55 20 93-39 155-30 52 7 89 32 191 23v88H0Z" />
          <path className="story-art__water" d="M0 145c81-12 143 6 214 4 92-2 181-18 306-3v44H0Z" />
          <g className="story-art__boat" transform="translate(330 129)"><path d="M0 17h74L61 32H13Z" /><path d="M36 17V0m2 3 24 12H38Z" /></g>
          <g className="story-art__shore" transform="translate(70 119)"><path d="M0 34c23-22 47-25 72-9 14 9 30 10 48 2" /></g>
        </>}

        {theme === 'passion' && <>
          <path className="story-art__far" d="M0 126c64-21 112-20 168-7 59 14 94-37 153-29 54 7 89 34 199 25v75H0Z" />
          <path className="story-art__valley" d="M0 151c88-9 153 13 228 8 72-5 117-24 177-21 48 2 82 10 115 21v31H0Z" />
          <g className="story-art__jerusalem" transform="translate(303 83)"><path d="M0 72V39h19V25h19v14h18V12h19v27h20v33Z" /><path d="M17 25 37 11l19 14M48 12 66 0l17 12" /><path d="M8 72V55h15v17m45 0V51h15v21" /></g>
          <g className="story-art__olive" transform="translate(88 108)"><path d="M20 52V16M20 28 3 12m18 8L38 5M8 17l-6-6m30 1 8-7" /><circle cx="3" cy="10" r="6"/><circle cx="39" cy="5" r="6"/></g>
        </>}

        {theme === 'revelation' && <>
          <path className="story-art__far" d="M0 124c64-22 111-20 163-8 59 14 96-37 156-28 57 8 91 35 201 25v77H0Z" />
          <path className="story-art__water" d="M0 151c92-15 157 11 238 4 93-8 171-19 282-7v42H0Z" />
          <g className="story-art__island" transform="translate(330 112)"><path d="M0 35c20-25 45-35 74-28 17 4 32 14 48 28Z"/><path d="M43 10 58 0l18 12"/></g>
          <g className="story-art__stars" transform="translate(85 42)"><circle cx="0" cy="0" r="2"/><circle cx="42" cy="18" r="2"/><circle cx="91" cy="4" r="1.5"/><circle cx="136" cy="26" r="2"/></g>
        </>}

        {theme === 'acts' && <>
          <path className="story-art__far" d="M0 126c72-21 126-18 184-3 56 14 96-35 154-27 55 7 89 31 182 23v71H0Z" />
          <path className="story-art__near" d="M0 160c79-18 139-10 207 3 76 15 145-21 225-10 40 5 68 12 88 22v15H0Z" />
          <g className="story-art__jerusalem" transform="translate(330 91)"><path d="M0 62V34h18V20h18v14h20V8h18v26h20v28Z" /><path d="M17 20 36 8l19 12M47 8 65 0l17 8" /></g>
          <g className="story-art__road" transform="translate(76 125)"><path d="M0 40c34-24 65-27 98-12 24 11 46 10 72-2" /></g>
        </>}

        {theme === 'mission' && <>
          <path className="story-art__far" d="M0 125 67 94l55 20 75-56 65 55 72-43 71 47 55-25 60 37v61H0Z" />
          <path className="story-art__water" d="M0 158c84-10 151 8 224 3 94-6 170-20 296-7v36H0Z" />
          <g className="story-art__ship" transform="translate(345 124)"><path d="M0 25h76L61 40H14Z" /><path d="M37 25V0m2 4 26 17H39Z" /></g>
          <g className="story-art__columns" transform="translate(84 111)"><path d="M0 44h76M12 44V12m22 32V12m22 32V12M5 12h65L59 2H16Z" /></g>
        </>}

        {theme === 'voyage' && <>
          <path className="story-art__far" d="M0 119c64-19 112-16 164-3 57 14 94-28 150-22 61 6 104 25 206 17v79H0Z" />
          <path className="story-art__water" d="M0 136c93-13 164 10 244 4 93-7 169-20 276-7v57H0Z" />
          <g className="story-art__ship" transform="translate(302 116)"><path d="M0 31h106L86 51H18Z" /><path d="M52 31V0m3 5 38 23H55Z" /><path d="M49 6 24 25h25" /></g>
          <path className="story-art__storm" d="M68 50c29-11 53-10 75 1m-55 17c36-13 65-10 90 5m215-37c24-7 44-5 62 4" />
        </>}

        {theme === 'assyria' && <>
          <path className="story-art__far" d="M0 126c68-22 118-18 173-2 56 17 94-39 152-29 53 9 86 33 195 24v71H0Z" />
          <path className="story-art__near" d="M0 160c78-17 139-10 204 4 76 16 150-23 226-11 40 6 67 13 90 22v15H0Z" />
          <g className="story-art__siege" transform="translate(321 98)"><path d="M0 57h96V17H77V4H61v13H39V0H24v17H0Z" /><path d="m-18 57 27-24 18 24" /><path d="M-8 47h32M5 35v22" /></g>
          <g className="story-art__spear-line" transform="translate(103 111)"><path d="M0 46 10 0m12 46L31 3m12 43L52 1m12 45L73 6" /></g>
        </>}

        <g className="story-art__traveler" transform="translate(250 121)"><circle cx="0" cy="0" r="7" /><path d="M-8 10c7-7 17-7 23 0l7 31H-15Z" /><path d="M18 8 27 47" /></g>
      </svg>
      <figcaption>Artistic landscape context · not an archaeological plan or portrait</figcaption>
    </figure>
  );
}
