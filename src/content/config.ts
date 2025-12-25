import { z, defineCollection } from 'astro:content';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

const legalCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

const consultationCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

const laborCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

const foreignerCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

const evaluationCollection = defineCollection({
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    rating: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

// Attorney Collection - Multilingual lawyer profiles
const attorneyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Name fields (multilingual)
    name: z.string(),
    name_en: z.string().optional(),
    name_zh: z.string().optional(),
    name_ja: z.string().optional(),
    name_ko: z.string().optional(),
    
    // Position and credentials
    position: z.string().optional(),
    credentials: z.array(z.string()).optional(),
    credentials_en: z.array(z.string()).optional(),
    credentials_zh: z.array(z.string()).optional(),
    credentials_ja: z.array(z.string()).optional(),
    credentials_ko: z.array(z.string()).optional(),
    
    // Bio fields (multilingual)
    bio: z.string().optional(),
    bio_en: z.string().optional(),
    bio_zh: z.string().optional(),
    bio_ja: z.string().optional(),
    bio_ko: z.string().optional(),
    shortBio: z.string().optional(),
    shortBio_en: z.string().optional(),
    shortBio_zh: z.string().optional(),
    shortBio_ja: z.string().optional(),
    shortBio_ko: z.string().optional(),
    
    // Contact and profile
    image: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    
    // Professional details
    practiceAreas: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    barNumber: z.string().optional(),
    barAssociation: z.string().optional(),
    barAssociation_en: z.string().optional(),
    barAssociation_zh: z.string().optional(),
    barAssociation_ja: z.string().optional(),
    barAssociation_ko: z.string().optional(),
    yearsExperience: z.number().optional(),
    
    // Education (multilingual)
    education: z.array(z.object({
      degree: z.string(),
      degree_en: z.string().optional(),
      degree_zh: z.string().optional(),
      degree_ja: z.string().optional(),
      degree_ko: z.string().optional(),
      institution: z.string(),
      institution_en: z.string().optional(),
      institution_zh: z.string().optional(),
      institution_ja: z.string().optional(),
      institution_ko: z.string().optional(),
      year: z.number().optional(),
    })).optional(),
    
    // Social links
    socialLinks: z.object({
      facebook: z.string().optional(),
      zalo: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
    
    // Specializations (multilingual)
    specializations: z.array(z.string()).optional(),
    specializations_en: z.array(z.string()).optional(),
    specializations_zh: z.array(z.string()).optional(),
    specializations_ja: z.array(z.string()).optional(),
    specializations_ko: z.array(z.string()).optional(),
    
    // Languages spoken (multilingual)
    languages: z.array(z.string()).optional(),
    languages_en: z.array(z.string()).optional(),
    languages_zh: z.array(z.string()).optional(),
    languages_ja: z.array(z.string()).optional(),
    languages_ko: z.array(z.string()).optional(),
    
    // Display options
    featured: z.boolean().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
    
    // Media
    youtubeId: z.string().optional(),
    youtubeTitle: z.string().optional(),
    youtubeTitle_en: z.string().optional(),
    youtubeTitle_zh: z.string().optional(),
    youtubeTitle_ja: z.string().optional(),
    youtubeTitle_ko: z.string().optional(),
    
    // Body content for other languages (Vietnamese is in the markdown body)
    bodyContent_en: z.string().optional(),
    bodyContent_zh: z.string().optional(),
    bodyContent_ja: z.string().optional(),
    bodyContent_ko: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  legal: legalCollection,
  consultation: consultationCollection,
  labor: laborCollection,
  foreigner: foreignerCollection,
  evaluation: evaluationCollection,
  attorney: attorneyCollection,
};
