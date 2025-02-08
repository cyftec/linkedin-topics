export const deepTrim = (text: string) =>
  text
    .replaceAll(String.fromCharCode(160), " ")
    .replace("\n\n\n\n", "\n")
    .replace("\n\n\n", "\n")
    .replace("\n\n", "\n")
    .replace(/\s+/g, " ");

export const getWordsCount = (text: string) => {
  const words = deepTrim(text).split(" ");
  const map = {};

  for (const word of words) {
    const topic = getLinkedInTag(word);
    if (!topic) continue;
    if (topic in map) map[topic]++;
    else map[topic] = 1;
  }

  return map;
};

export const getLinkedInTag = (word: string) => {
  const w = word.replaceAll("\n", "");
  const tag = w.startsWith("hashtag#") ? w.replace("hashtag#", "") : "";
  return tag;
};

export const getTags = (text: string) => {
  const words = deepTrim(text).split(" ");
  const map = {};

  for (const word of words) {
    const topic = getLinkedInTag(word);
    if (!topic) continue;
    else map[topic] = true;
  }

  return Object.keys(map);
};

export const getTopRepetitingWords = (map: Record<string, number>) => {
  const topMap = {};
  Object.entries(map).forEach(([word, count]) => {
    topMap[count] = [...(topMap[count] || []), word];
  });
  return topMap;
};
