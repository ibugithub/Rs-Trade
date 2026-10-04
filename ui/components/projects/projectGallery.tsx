'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, Camera, MapPin, Play } from 'lucide-react';
import { projectStories, projectVideos, type ProjectCategory } from '@/content/projects';

const categories: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'factory-visits', label: 'Factory Visits' },
  { value: 'product-inspections', label: 'Product Inspections' },
  { value: 'completed-projects', label: 'Completed Projects' },
];

export function ProjectGallery() {
  const [category, setCategory] = useState<'all' | ProjectCategory>('all');
  const stories = category === 'all' ? projectStories : projectStories.filter(story => story.category === category);

  return (
    <>
      <section id="project-stories" className="scroll-mt-28 py-14 sm:py-20" aria-labelledby="stories-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Photos and stories</p>
        <h2 id="stories-title" className="mt-3 text-3xl font-bold tracking-tight">A closer look at our work.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600">Factory visits, product inspections and completed projects, with the context behind each activity.</p>
        <div role="group" aria-label="Filter projects" className="mt-7 flex flex-wrap gap-2">
          {categories.map(item => <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)} className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${category === item.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-700'}`}>{item.label}</button>)}
        </div>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{stories.length ? `${stories.length} project stories shown.` : 'No project stories published in this category yet.'}</div>
        {stories.length ? (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            {stories.map(story => (
              <article key={story.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {story.photos[0] && <div className="relative aspect-[4/3] bg-gray-50"><Image src={story.photos[0].src} alt={story.photos[0].alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div>}
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">{categories.find(item => item.value === story.category)?.label}</p>
                  <h3 className="mt-3 text-2xl font-bold">{story.title}</h3>
                  {(story.location || story.dateLabel) && <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">{story.location && <><MapPin size={15} aria-hidden="true" />{story.location}</>}{story.location && story.dateLabel && <span aria-hidden="true">·</span>}{story.dateLabel}</p>}
                  <p className="mt-4 text-sm leading-7 text-gray-600">{story.summary}</p>
                  <details className="mt-5 border-t border-gray-200 pt-5">
                    <summary className="cursor-pointer text-sm font-semibold text-blue-700 focus-visible:outline-blue-600">Read the story and view photos</summary>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">{story.story.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{story.outcome && <p className="rounded-lg bg-blue-50 p-4"><strong className="text-gray-900">Outcome: </strong>{story.outcome}</p>}</div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">{story.photos.map((photo, index) => <figure key={`${photo.src}-${index}`}><div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div>{photo.caption && <figcaption className="mt-2 text-xs leading-5 text-gray-500">{photo.caption}</figcaption>}</figure>)}</div>
                  </details>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center sm:px-10">
            <Camera size={32} className="mx-auto text-blue-700" aria-hidden="true" />
            <h3 className="mt-5 text-xl font-bold">{projectStories.length ? 'Stories in this category are coming soon.' : 'Project stories are coming soon.'}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600">{projectStories.length ? 'Explore another category to see published work.' : 'Real factory visit photos and the stories behind our work will be shared here.'}</p>
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20" aria-labelledby="videos-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Video updates</p>
        <h2 id="videos-title" className="mt-3 text-3xl font-bold tracking-tight">See the work in motion.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600">Watch our public video updates on YouTube and Facebook.</p>
        {projectVideos.length ? <div className="mt-8 grid gap-5 md:grid-cols-2">{projectVideos.map(video => <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-gray-200 p-6 transition-colors hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Play size={28} className="text-blue-700" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold">{video.title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{video.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Watch on {video.platform}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></span></a>)}</div> : <div className="mt-8 flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6"><Play size={26} className="shrink-0 text-blue-700" aria-hidden="true" /><div><h3 className="font-semibold">Video updates are coming soon.</h3><p className="mt-2 text-sm leading-7 text-gray-600">Links to our factory visits and inspection videos will appear here when published.</p></div></div>}
      </section>
    </>
  );
}
