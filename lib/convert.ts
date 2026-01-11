'use client';

import Kuroshiro from '@sglkc/kuroshiro';

import Analyzer from '@/lib/analyzer';
import {
    HIRA_UK_ALPHABET,
    KANA_UK_ALPHABET,
    ROMAJI_UK_ALPHABET,
} from '@/lib/constants';





const ALPHABET: Record<string, string> = {
    ...HIRA_UK_ALPHABET,
    ...KANA_UK_ALPHABET,
    ...ROMAJI_UK_ALPHABET,
};

const kuroshiro = new Kuroshiro();
kuroshiro.init(new Analyzer());

export async function romajiToKovalenko(text: string): Promise<string> {
    const convertKanji = await kuroshiro.convert(text, {
        to: 'romaji',
        romajiSystem: 'passport',
});
  
export const applyKovalenkoNasalRules = (text: string): string => {
  
  let result = text;

  // Pattern for 'n' followed by 'i' where 'n' is a separate syllable (ん)
  result = result
    .replace(/n'i/g, "н'ї")
    .replace(/n'I/g, "н'Ї")
    .replace(/N'i/g, "Н'ї")
    .replace(/N'I/g, "Н'Ї")
    
    // Pattern for 'n' followed by 'e' where 'n' is a separate syllable (ん)
    .replace(/n'e/g, "н'е")
    .replace(/n'E/g, "н'Е")
    .replace(/N'e/g, "Н'е")
    .replace(/N'E/g, "Н'Е");
  
  return result;
};

export const convert = (input: string): string => {

  const step1 = input.replace(/ん/g, "n'"); 
  return applyKovalenkoNasalRules(step1);
};
    const lowerRomaji = convertKanji.toLowerCase();
    let translated: string = '';
    let i: number = 0;

    while (i < lowerRomaji.length) {
        if (lowerRomaji[i] === ' ') {
            translated += ' ';
            i++;
        } else {
            let checkLen: number = Math.min(3, lowerRomaji.length - i);

            while (checkLen > 0) {
                const checkStr: string = lowerRomaji.slice(i, i + checkLen);

                if (ALPHABET[checkStr] !== undefined) {
                    if (
                        ['a', 'u', 'i', 'o', 'e'].includes(
                            lowerRomaji.slice(i - 1, i)
                        ) &&
                        checkStr === 'i'
                    ) {
                        if (lowerRomaji.slice(i + 1, i + 2) === ' ') {
                            translated += 'й';
                        } else {
                            translated += 'ї';
                        }
                    } else if (
                        checkStr === 'e' &&
                        lowerRomaji.slice(i - 1, i) === 'i'
                    ) {
                        translated += 'є';
                    } else if (
                        checkStr === 'n' &&
                        ['m', 'b', 'p'].includes(
                            lowerRomaji.slice(i + 1, i + 2)
                        )
                    ) {
                        translated += 'м';
                    } else {
                        translated += ALPHABET[checkStr];
                    }

                    i += checkLen;

                    if (i < lowerRomaji.length) {
                        if (
                            lowerRomaji[i] === 'o' &&
                            lowerRomaji.slice(i - 1, i) === 'o'
                        ) {
                            translated += ALPHABET['u'];
                            i++;
                        } else if (
                            lowerRomaji[i] === 'e' &&
                            lowerRomaji.slice(i - 1, i) === 'e'
                        ) {
                            translated += ALPHABET['i'];
                            i++;
                        }
                    }

                    break;
                }

                checkLen--;
            }

            if (checkLen === 0) {
                if (text[i] !== undefined) {
                    translated += text[i];
                }
                i++;
            }
        }
    }

    return translated;
}
