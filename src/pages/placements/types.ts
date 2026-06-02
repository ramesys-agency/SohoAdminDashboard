export const AppPage = {
  CATALOG_MEN: "MEN",
  CATALOG_WOMEN: "WOMEN",
  CATALOG_KIDS: "KIDS",
  OFFERS: "OFFERS",
  HOME: "HOME",
} as const;

export type AppPage = (typeof AppPage)[keyof typeof AppPage];

// Human-readable labels for each AppPage API value
export const PAGE_DISPLAY_LABEL: Record<AppPage, string> = {
  MEN: "Catalog (MEN)",
  WOMEN: "Catalog (WOMEN)",
  KIDS: "Catalog (KIDS)",
  OFFERS: "Offers",
  HOME: "Home",
};

export const PageSection = {
  FEATURED_ROW: "FEATURED_ROW",
  GRID_SECTION: "GRID_SECTION",
  HERO: "HERO",
  MID_BANNER: "MID_BANNER",
  SEE_ALL: "SEE_ALL",
} as const;

export type PageSection = (typeof PageSection)[keyof typeof PageSection];

// Map Pages to their allowed Sections
export const PAGE_SECTION_MAP: Record<AppPage, PageSection[]> = {
  [AppPage.CATALOG_MEN]: [PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.CATALOG_WOMEN]: [PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.CATALOG_KIDS]: [PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.OFFERS]: [], // No sections
  [AppPage.HOME]: [PageSection.HERO],
};

// Human-readable labels/guidance for each Section to help the Admin
export const SECTION_GUIDANCE_MAP: Record<PageSection, string> = {
  [PageSection.HERO]: "Top Banner Slider: Appears at the very top of the Homepage as a sliding/carousel landscape banner.",
  [PageSection.FEATURED_ROW]: "Large Section: Renders as a full-width massive portrait image (like Women Fashionable Top) with title and description.",
  [PageSection.GRID_SECTION]: "Collage Section: Renders as a 3-image collage layout (like Fashionable Dress). Uses the placement cover image on the left, and first 2 collection products' primary images on the right.",
  [PageSection.MID_BANNER]: "Side Image Section: Renders with the text/title on the left and a portrait image on the right (like Luxurious Gown).",
  [PageSection.SEE_ALL]: "Horizontal Section: Renders with a wide horizontal landscape image on top, followed by title and description below it (like Fashionable Heels).",
};

// Sections that are always displayed as banners
export const BANNER_SECTIONS = new Set<PageSection>([
  PageSection.FEATURED_ROW,
  PageSection.HERO,
  PageSection.MID_BANNER,
  PageSection.SEE_ALL,
]);

/** Returns true if the given section is a banner-type placement */
export const isBannerSection = (section: string): boolean =>
  BANNER_SECTIONS.has(section as PageSection);

// Section Preview Images
export const SECTION_PREVIEW_MAP: Record<PageSection, string> = {
  [PageSection.FEATURED_ROW]: "https://placehold.co/600x400/FFF/EEE?text=Featured+Row+Large+Mobile+Preview",
  [PageSection.GRID_SECTION]: "https://placehold.co/600x400/FFF/EEE?text=Grid+Section+Collage+Mobile+Preview",
  [PageSection.HERO]: "https://placehold.co/600x400/FFF/EEE?text=Top+Banner+Hero+Mobile+Preview",
  [PageSection.MID_BANNER]: "https://placehold.co/600x400/FFF/EEE?text=Side+Image+Mobile+Preview",
  [PageSection.SEE_ALL]: "https://placehold.co/600x400/FFF/EEE?text=Horizontal+Mobile+Preview",
};
