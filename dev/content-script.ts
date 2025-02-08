import { derived, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  PAGE_LOAD_COMPLETE_MSG,
  SELECTORS,
  UI_ELEM_ID,
} from "./@libs/constants";
import { getWordsCount } from "./@libs/utils";

/**
 * This extension uses the data coming in aria-label and/or tooltips for a more
 * correct and unabbreviated number (e.g. 2M for 2,000,000);
 *
 * KNOWN ISSUE
 * Sometimes the locale number format in aria-label mismatches that with
 * the locale set for the document. That results in an incorrect score.
 *
 * For example, in case of 'bosanski' language, the 'lang' attribute of the document
 * is set to 'bs-Latn-BA' (check html[lang="bs-Latn-BA"] for same), in which the
 * decimal in a number is representated with a comma (','). While the formatted
 * number string coming from backend for like button's aria-label has the
 * opposite, i.e. number with point (.) decimal.
 */

const videoUpdatedCount = signal(0);

const topics = derived(() => {
  if (!videoUpdatedCount.value) return {};
  const comments: any[] = [];
  const totalPosts = Array.from(
    document.querySelectorAll(SELECTORS.FEED_ITEM)
  ).filter((node) => {
    if ((node as HTMLElement).closest(`.comments-comment-entity`)) {
      comments.push(node);
      return false;
    }

    return isVisible(node as HTMLElement);
  });
  console.log(`Total comments: ${comments.length}`);
  console.log(`Total posts: ${totalPosts.length}`);

  const feedText = totalPosts.reduce(
    (concatText, postNode) => `${concatText} ${postNode.textContent || ""}`,
    ""
  );
  return getWordsCount(feedText || "");
});

const TopicsUI = m.Div({
  id: UI_ELEM_ID,
  class: `mv4 z-999 sticky top-3`,
  children: [
    m.Style(
      `@import url("https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css");

      #${UI_ELEM_ID} {
        position: sticky;
        top: 5rem;
      }
      
      .title { field-sizing: content; }
      `
    ),
    m.Div({
      class: "flex flex-wrap br4 bg-white pt3 pr3 gra",
      children: m.For({
        subject: derived(() =>
          Object.entries(topics.value).sort(
            (a, b) => (b[1] as number) - (a[1] as number)
          )
        ),
        n: 0,
        nthChild: m.Span({
          class: "f4 ml3 mb2 title",
          children: m.Select({
            children: [m.Option(`Show selected`), m.Option(`Hide selected`)],
          }),
        }),
        map: ([tag, count]) =>
          m.Span({
            class: `f4 ml3 mb2 shadow-hover`,
            children: `#${tag} ${count}`,
          }),
      }),
    }),
  ],
})();

const injectUI = () => {
  const container = document.querySelector(SELECTORS.UI_CONTAINER);
  if (!container) {
    console.error(
      `The feed page container ID is either changed by LinkedIn or misspelled.`
    );
    return;
  }

  container.prepend(TopicsUI);
};

const isVisible = (el: HTMLElement) => !!el.offsetParent;

const insideFeedList = (el: HTMLElement) => !!el.closest(SELECTORS.FEED);

const onMutation = (mutation: MutationRecord) => {
  const { type, addedNodes, target } = mutation;

  if (type === "childList" && insideFeedList(target as HTMLElement)) {
    videoUpdatedCount.value++;
    console.log(type, target);
  }
};

let lastTimeStamp = new Date().getTime();
const runMutationWhenIdle = (mutation: MutationRecord) => {
  lastTimeStamp = new Date().getTime();
  setTimeout(() => {
    if (new Date().getTime() - lastTimeStamp > 1500) {
      onMutation(mutation);
    }
  }, 1500);
};

const startObservingPage = () => {
  new MutationObserver((mutations, observer) => {
    mutations.forEach(runMutationWhenIdle);
  }).observe(document, { childList: true, subtree: true });
};

const runExtension = () => {
  chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    if (message === PAGE_LOAD_COMPLETE_MSG) {
      startObservingPage();
      injectUI();
    }
  });
};

runExtension();
