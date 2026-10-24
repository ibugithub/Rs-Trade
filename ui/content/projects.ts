export type ProjectCategory = 'factory-visits' | 'product-inspections' | 'completed-projects';

export type ProjectStory = {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  story: string[];
  photos: { src: string; alt: string; caption?: string }[];
  location?: string;
  dateLabel?: string;
  outcome?: string;
};

export type ProjectVideo = {
  id: string;
  title: string;
  description: string;
  platform: 'YouTube' | 'Facebook';
  url: string;
};

// Add only owner-approved stories and real photos here, in the desired display
// order. Local photo paths start with /images/. Do not populate with demo work.
export const projectStories: ProjectStory[] = [];

// Add the owner's actual public YouTube/Facebook video URLs when supplied.
export const projectVideos: ProjectVideo[] = [];
