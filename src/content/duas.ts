import type { DuaText } from '../components/Dua';

// Content pending ustadz review (see docs/PRD.md §6). Only du'a with clear evidence by default.

export const DUA_BERBUKA: DuaText = {
  title: "Doa berbuka puasa",
  arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
  latin: "Dzahabazh zhama'u wabtallatil 'uruuqu wa tsabatal ajru in syaa Allah",
  translation: {
    id: 'Telah hilang rasa haus, urat-urat telah basah, dan pahala telah tetap, insya Allah.',
    en: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
  },
  source: 'HR. Abu Dawud no. 2357 (hasan)',
};

export const DUA_RUKUN_YAMANI: DuaText = {
  title: "Antara Rukun Yamani dan Hajar Aswad",
  arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  latin: "Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar",
  translation: {
    id: 'Wahai Rabb kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
  },
  source: 'QS. Al-Baqarah: 201; HR. Abu Dawud no. 1892',
};
