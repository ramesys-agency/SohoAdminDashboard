import type { Placement } from "../../api/placements";

/** Every page canvas is driven by the same handful of callbacks. */
export interface CanvasProps {
  placements: Placement[];
  onEdit: (placement: Placement) => void;
  onAdd: (section: PageSection) => void;
  onDelete: (placement: Placement) => void;
  onProducts: (placement: Placement) => void;
  onReorder: (ordered: Placement[]) => void;
}

export const AppPage = {
  HOME: "HOME",
  CATALOG_MEN: "MEN",
  CATALOG_WOMEN: "WOMEN",
  CATALOG_KIDS: "KIDS",
  OFFERS: "OFFERS",
} as const;

export type AppPage = (typeof AppPage)[keyof typeof AppPage];

// Human-readable labels for each AppPage API value
export const PAGE_DISPLAY_LABEL: Record<AppPage, string> = {
  HOME: "Home",
  MEN: "Catalog (MEN)",
  WOMEN: "Catalog (WOMEN)",
  KIDS: "Catalog (KIDS)",
  OFFERS: "Offers",
};

export const PageSection = {
  HERO: "HERO",
  FEATURED_ROW: "FEATURED_ROW",
  GRID_SECTION: "GRID_SECTION",
  MID_BANNER: "MID_BANNER",
  SEE_ALL: "SEE_ALL",
} as const;

export type PageSection = (typeof PageSection)[keyof typeof PageSection];

// Map Pages to their allowed Sections. Home renders every layout; catalog pages
// use a banner carousel plus a card grid; offers is a single stack of cards.
export const PAGE_SECTION_MAP: Record<AppPage, PageSection[]> = {
  [AppPage.HOME]: [
    PageSection.HERO,
    PageSection.FEATURED_ROW,
    PageSection.GRID_SECTION,
    PageSection.MID_BANNER,
    PageSection.SEE_ALL,
  ],
  [AppPage.CATALOG_MEN]: [PageSection.HERO, PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.CATALOG_WOMEN]: [PageSection.HERO, PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.CATALOG_KIDS]: [PageSection.HERO, PageSection.FEATURED_ROW, PageSection.GRID_SECTION],
  [AppPage.OFFERS]: [PageSection.GRID_SECTION],
};

// Short label for chips and dropdowns
export const SECTION_DISPLAY_LABEL: Record<PageSection, string> = {
  [PageSection.HERO]: "Hero Banner",
  [PageSection.FEATURED_ROW]: "Featured (Large)",
  [PageSection.GRID_SECTION]: "Grid Card (Collage)",
  [PageSection.MID_BANNER]: "Side Image",
  [PageSection.SEE_ALL]: "Horizontal Banner",
};

// Human-readable labels/guidance for each Section to help the Admin
export const SECTION_GUIDANCE_MAP: Record<PageSection, string> = {
  [PageSection.HERO]:
    "Top Banner Slider: Appears at the very top of the page as a sliding/carousel landscape banner.",
  [PageSection.FEATURED_ROW]:
    "Large Section: Renders as a full-width massive portrait image with title and description.",
  [PageSection.GRID_SECTION]:
    "Collage Section: Uses the placement cover image on the left, and the first 2 products' primary images on the right.",
  [PageSection.MID_BANNER]:
    "Side Image Section: Renders with the text/title on the left and a portrait image on the right.",
  [PageSection.SEE_ALL]:
    "Horizontal Section: Renders a wide landscape image on top, followed by title and description below it.",
};

// Sections that are always displayed as banners
export const BANNER_SECTIONS = new Set<PageSection>([
  PageSection.HERO,
  PageSection.FEATURED_ROW,
  PageSection.MID_BANNER,
  PageSection.SEE_ALL,
]);

/** Returns true if the given section is a banner-type placement */
export const isBannerSection = (section: string): boolean =>
  BANNER_SECTIONS.has(section as PageSection);

/** The mobile layout each section maps to — mirrors FeaturedSection's variants. */
export const SECTION_VARIANT_MAP: Record<
  PageSection,
  "hero" | "large" | "collage" | "side" | "horizontal"
> = {
  [PageSection.HERO]: "hero",
  [PageSection.FEATURED_ROW]: "large",
  [PageSection.GRID_SECTION]: "collage",
  [PageSection.MID_BANNER]: "side",
  [PageSection.SEE_ALL]: "horizontal",
};

// Section Preview Images
export const SECTION_PREVIEW_MAP: Record<PageSection, string> = {
  [PageSection.HERO]: "https://placehold.co/600x400/FFF/EEE?text=Top+Banner+Hero+Mobile+Preview",
  [PageSection.FEATURED_ROW]:
    "https://placehold.co/600x400/FFF/EEE?text=Featured+Row+Large+Mobile+Preview",
  [PageSection.GRID_SECTION]:
    "https://placehold.co/600x400/FFF/EEE?text=Grid+Section+Collage+Mobile+Preview",
  [PageSection.MID_BANNER]: "https://placehold.co/600x400/FFF/EEE?text=Side+Image+Mobile+Preview",
  [PageSection.SEE_ALL]: "https://placehold.co/600x400/FFF/EEE?text=Horizontal+Mobile+Preview",
};
