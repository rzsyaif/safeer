import { useSettings } from '../lib/settings';

export interface DuaText {
  title: string;
  arabic: string;
  latin: string;
  translation: { id: string; en: string };
  source?: string;
}

/** Renders any du'a / dzikir honouring the reader's text settings. */
export function Dua({ dua }: { dua: DuaText }) {
  const { text } = useSettings().settings;
  return (
    <article className="card dua">
      <h3 className="title-card">{dua.title}</h3>
      {text.showArabic && (
        <p className="arabic" lang="ar" dir="rtl">
          {dua.arabic}
        </p>
      )}
      {text.showLatin && <p className="latin">{dua.latin}</p>}
      {text.showTranslation && <p className="translation">{dua.translation[text.translationLang]}</p>}
      {dua.source && <p className="caption muted">{dua.source}</p>}
    </article>
  );
}
