import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://issafoundation.org';
  return [
    { url: baseUrl },
    { url: `${baseUrl}/programs` },
    { url: `${baseUrl}/impact` },
    { url: `${baseUrl}/stories` },
    { url: `${baseUrl}/careers` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ];
}
