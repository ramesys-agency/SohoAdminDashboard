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

// Sections that are always displayed as banners
export const BANNER_SECTIONS = new Set<PageSection>([
  PageSection.FEATURED_ROW,
  PageSection.HERO,
]);

/** Returns true if the given section is a banner-type placement */
export const isBannerSection = (section: string): boolean =>
  BANNER_SECTIONS.has(section as PageSection);

// Section Preview Images
export const SECTION_PREVIEW_MAP: Record<PageSection, string> = {
  [PageSection.FEATURED_ROW]: "https://placehold.co/600x400/FFF/EEE?text=Featured+Row+Mobile+Preview",
  [PageSection.GRID_SECTION]: "https://placehold.co/600x400/FFF/EEE?text=Grid+Section+Mobile+Preview",
  [PageSection.HERO]: "https://placehold.co/600x400/FFF/EEE?text=Hero+Mobile+Preview",
};
