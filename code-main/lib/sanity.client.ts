// lib/sanity.js
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = sanityClient({
    projectId: 'ppbjqx11', // from sanity dashboard
    dataset: 'production',
    apiVersion: '2025-01-01', // use a recent ISO date
    useCdn: true
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)
