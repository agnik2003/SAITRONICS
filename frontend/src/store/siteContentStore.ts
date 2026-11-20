'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SiteContent, HeroSlide, FeaturedCollection } from '@/types';
import { seedSiteContent } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface SiteContentStore {
  content: SiteContent;
  updateAnnouncementBar: (bar: Partial<SiteContent['announcementBar']>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  toggleSectionVisibility: (sectionKey: keyof SiteContent['sectionsVisibility']) => void;
  updateNewLaunches: (data: Partial<SiteContent['newLaunchesHeading']>) => void;
  updateFeaturedCollections: (collections: FeaturedCollection[]) => void;
  updateFeaturedCollection: (id: string, updates: Partial<FeaturedCollection>) => void;
  updateBestsellersHeading: (data: Partial<SiteContent['bestsellersHeading']>) => void;
  updateAudioBanner: (data: Partial<SiteContent['audioBanner']>) => void;
  updatePromoBlock: (data: Partial<SiteContent['promoBlock']>) => void;
  resetSection: (section: 'hero' | 'announcement' | 'launches' | 'collections' | 'all') => void;
  importContent: (imported: SiteContent) => void;
}

const STORAGE_KEY = 'saitronics-site-content';

export const useSiteContentStore = create<SiteContentStore>()(
  persist(
    (set) => ({
      content: seedSiteContent,

      updateAnnouncementBar: (bar) => {
        set((state) => ({
          content: {
            ...state.content,
            announcementBar: { ...state.content.announcementBar, ...bar }
          }
        }));
      },

      addHeroSlide: (slide) => {
        set((state) => ({
          content: {
            ...state.content,
            heroSlides: [...state.content.heroSlides, slide]
          }
        }));
      },

      updateHeroSlide: (id, updates) => {
        set((state) => ({
          content: {
            ...state.content,
            heroSlides: state.content.heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s))
          }
        }));
      },

      deleteHeroSlide: (id) => {
        set((state) => ({
          content: {
            ...state.content,
            heroSlides: state.content.heroSlides.filter((s) => s.id !== id)
          }
        }));
      },

      reorderHeroSlides: (slides) => {
        set((state) => ({
          content: {
            ...state.content,
            heroSlides: slides
          }
        }));
      },

      toggleSectionVisibility: (sectionKey) => {
        set((state) => ({
          content: {
            ...state.content,
            sectionsVisibility: {
              ...state.content.sectionsVisibility,
              [sectionKey]: !state.content.sectionsVisibility[sectionKey]
            }
          }
        }));
      },

      updateNewLaunches: (data) => {
        set((state) => ({
          content: {
            ...state.content,
            newLaunchesHeading: { ...state.content.newLaunchesHeading, ...data }
          }
        }));
      },

      updateFeaturedCollections: (collections) => {
        set((state) => ({
          content: {
            ...state.content,
            featuredCollections: collections
          }
        }));
      },

      updateFeaturedCollection: (id, updates) => {
        set((state) => ({
          content: {
            ...state.content,
            featuredCollections: state.content.featuredCollections.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            )
          }
        }));
      },

      updateBestsellersHeading: (data) => {
        set((state) => ({
          content: {
            ...state.content,
            bestsellersHeading: { ...state.content.bestsellersHeading, ...data }
          }
        }));
      },

      updateAudioBanner: (data) => {
        set((state) => ({
          content: {
            ...state.content,
            audioBanner: { ...state.content.audioBanner, ...data }
          }
        }));
      },

      updatePromoBlock: (data) => {
        set((state) => ({
          content: {
            ...state.content,
            promoBlock: { ...state.content.promoBlock, ...data }
          }
        }));
      },

      resetSection: (section) => {
        set((state) => {
          if (section === 'hero') {
            return { content: { ...state.content, heroSlides: seedSiteContent.heroSlides } };
          }
          if (section === 'announcement') {
            return { content: { ...state.content, announcementBar: seedSiteContent.announcementBar } };
          }
          if (section === 'launches') {
            return { content: { ...state.content, newLaunchesHeading: seedSiteContent.newLaunchesHeading } };
          }
          if (section === 'collections') {
            return { content: { ...state.content, featuredCollections: seedSiteContent.featuredCollections } };
          }
          return { content: seedSiteContent };
        });
      },

      importContent: (imported) => {
        if (imported && typeof imported === 'object') {
          set({ content: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || !persistedState.content) {
          return { content: seedSiteContent };
        }
        // Ensure hero slides have valid images and structure
        const existingSlides = Array.isArray(persistedState.content.heroSlides) ? persistedState.content.heroSlides : [];
        const mergedSlides = existingSlides.length > 0
          ? existingSlides.map((s: any, idx: number) => {
              const fallback = seedSiteContent.heroSlides[idx] || seedSiteContent.heroSlides[0];
              return {
                ...fallback,
                ...s,
                image: s.image || fallback.image
              };
            })
          : seedSiteContent.heroSlides;

        return {
          ...persistedState,
          content: {
            ...seedSiteContent,
            ...persistedState.content,
            heroSlides: mergedSlides
          }
        };
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useSiteContentStore.persist.rehydrate());
}
