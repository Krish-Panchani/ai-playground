export const buildStoryContext = (chapters = []) => {
  if (!chapters.length) {
    return "";
  }

  return chapters
    .map((chapter, index) => `Chapter ${index + 1} — ${chapter.title}\n${chapter.chapter}`)
    .join("\n\n");
};
