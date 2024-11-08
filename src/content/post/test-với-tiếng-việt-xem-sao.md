---
title: test với tiếng Việt xem sao
excerpt: test với tiếng Việt xem sao
category: Test
image: /_astro/20201025_160947.jpg
author: Trung
rating: 5
---
import {defineCollection, z} from 'astro:content';



![xxx](/images/457577946_10161931282689727_2029435220945721919_n.jpg "xxx")

const blog = defineCollection({

  type: 'content',

  schema: z.object({

\    title: z.string(),

\    description: z.string().optional().nullable(),

\    date: z.date(),

\    tags: z.array(z.string()).or(z.string()).optional().nullable(),

\    category: z.array(z.string()).or(z.string()).default('uncategorized').nullable(),

\    sticky: z.number().default(0).nullable(),

\    mathjax: z.boolean().default(false).nullable(),

\    mermaid: z.boolean().default(false).nullable(),

\    draft: z.boolean().default(false).nullable(),

\    toc: z.boolean().default(true).nullable(),

\    donate: z.boolean().default(true).nullable(),

\    comment: z.boolean().default(true).nullable(),

  }),

});

const feed = defineCollection({

  schema: z.object({

\    date: z.date().or(z.string()).optional().nullable(),

\    donate: z.boolean().default(true),

\    comment: z.boolean().default(true),

  })

})

export const collections = {blog, feed};
