export const HOST_URL_IDENTIFIER = "https://www.linkedin.com/*";
export const APP_NAME = "LinkedIn Topics";
export const APP_DESCRIPTION = "Topic filter for LinkedIn posts.";

export const UI_ELEM_ID = "linkedin-topics";
export const PAGE_LOAD_COMPLETE_MSG = "PAGE_LOAD_COMPLETE";
export const FEED_ATTRIBUTE_KEY = `data-finite-scroll-hotkey-context`;
export const FEED_ATTRIBUTE_VALUE = `FEED`;
export const FEED_ITEM_ATTRIBUTE_KEY = `data-view-name`;
export const FEED_ITEM_ATTRIBUTE_VALUE = `feed-full-update`;
export const SELECTORS = {
  UI_CONTAINER: `#voyager-feed .scaffold-layout__inner`,
  FEED: `[${FEED_ATTRIBUTE_KEY}="${FEED_ATTRIBUTE_VALUE}"]`,
  FEED_ITEM: `[${FEED_ITEM_ATTRIBUTE_KEY}="${FEED_ITEM_ATTRIBUTE_VALUE}"] .update-components-text`,
};
