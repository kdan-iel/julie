export interface TimelineMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface EventDetail {
  id: string;
  time: string;
  title: string;
  locationName: string;
  address: string;
  description: string;
  dressCode?: string;
  iconName: 'church' | 'cheers' | 'utensils' | 'music' | 'sun';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'histoire' | 'fiancailles' | 'lieu' | 'ambiance';
  imageUrl: string;
  caption: string;
}

export interface RSVPFormData {
  id?: string;
  lastName: string;
  firstName: string;
  email: string;
  attending: 'yes' | 'no';
  guestCount: number;
  guestNames?: string;
  dietaryRestrictions: string;
  menuChoice: 'classic' | 'vegetarian' | 'child';
  shuttleNeeded: boolean;
  songRequest?: string;
  message: string;
  createdAt?: string;
}

export interface JourneyKeyframe {
  sectionId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}
