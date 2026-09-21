import { GoogleReview } from '../types';

export interface ExperienceActivity {
  id: string;
  hostId: string;
  title: string;
  category: 'safari' | 'city_tour' | 'cinema' | 'arts_culture' | 'gastronomy';
  price: number;
  duration: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  inclusions: string[];
}

export interface ExperienceHost {
  id: string;
  name: string;
  tagline: string;
  category: string;
  rating: number;
  reviewsCount: number;
  googleRating: number;
  googleReviewsCount: number;
  googleReviews?: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  image: string;
  location: string;
  activities: ExperienceActivity[];
}

export const EXPERIENCE_HOSTS: ExperienceHost[] = [
  {
    id: 'host-safari',
    name: 'Skyward Mara Aviators & Luxury Balloon Safaris',
    tagline: 'Private hot-air balloon flights & twin-engine Cessna bush flights over the Great Migration',
    category: 'Safari & Aerial Expeditions',
    rating: 5.0,
    reviewsCount: 320,
    googleRating: 5.0,
    googleReviewsCount: 640,
    googleReviews: [
      {
        id: 'rev-exp-1',
        author: 'Lady Charlotte Windsor',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '4 days ago',
        text: 'Drifting over the Mara River at dawn with thousands of wildebeest below us was life-altering. The champagne bush breakfast afterward was impeccably set.',
        likes: 31,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@skywardmara.safari',
      googleMaps: 'https://maps.google.com/?q=Maasai+Mara+Balloon+Aviation',
      website: 'https://skywardsafari.luxury',
      phone: '+254 700 555 MARA',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Bu3cF-b3BlhVlVeSfx_0QHS0bc3C91nQp8crsFdDsX1XEVKH6b6sg4g6EqKA0x-VYVywLlHzho0hU-0B9M8nJIg1KMJFB4aRXQ-65uIpboeNVg-ZAtds5vCGKVtYNrs9ntJx4LRuN_YV0Fhnk20y9ut9tMqYZ3p31by3GzvPBoODktQ898aawelmsTCxlZMeZP7oATFXNohWpyRwMAm4OuSZkSdlOOcBMjJtsXwZ2gc8xiehvWHl',
    location: 'Maasai Mara National Reserve',
    activities: [
      {
        id: 'act-mara-safari',
        hostId: 'host-safari',
        title: 'Maasai Mara Private Fly-In Day Safari & Game Drive',
        category: 'safari',
        price: 1200,
        duration: 'Full Day (10 hours)',
        location: 'Maasai Mara Reserve',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Bu3cF-b3BlhVlVeSfx_0QHS0bc3C91nQp8crsFdDsX1XEVKH6b6sg4g6EqKA0x-VYVywLlHzho0hU-0B9M8nJIg1KMJFB4aRXQ-65uIpboeNVg-ZAtds5vCGKVtYNrs9ntJx4LRuN_YV0Fhnk20y9ut9tMqYZ3p31by3GzvPBoODktQ898aawelmsTCxlZMeZP7oATFXNohWpyRwMAm4OuSZkSdlOOcBMjJtsXwZ2gc8xiehvWHl',
        description: 'Private chartered aircraft from Wilson Airport landing directly in the Mara. Includes custom open-top 4x4 Land Cruiser with master wildlife tracker and gourmet bush lunch.',
        rating: 5.0,
        reviewsCount: 210,
        inclusions: ['Roundtrip Private Flight', 'Custom 4x4 Land Cruiser', 'Gourmet Bush Lunch & Wine', 'Reserve Entry Fees'],
      },
    ],
  },
  {
    id: 'host-conservation',
    name: 'Nairobi Wildlife Heritage & Conservation Sanctuary',
    tagline: 'Private access to orphaned baby elephants, endangered Rothschild giraffes & skyline safari',
    category: 'Conservation & Wildlife Tours',
    rating: 4.96,
    reviewsCount: 290,
    googleRating: 4.9,
    googleReviewsCount: 510,
    googleReviews: [
      {
        id: 'rev-exp-2',
        author: 'Dr. Michael Montgomery',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '1 week ago',
        text: 'The private keeper tour with the orphaned elephants was heartwarming. The giraffe feeding platform gives incredible personal photo opportunities.',
        likes: 22,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@nairobiwildlife.heritage',
      googleMaps: 'https://maps.google.com/?q=Giraffe+Centre+Karen',
      website: 'https://nairobiheritage.org',
      phone: '+254 711 555 WILD',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZqrcMvcUNv1lUhdftIGbBYiGM3PD6OzWA_aaBj2-jYevTM96tQPWGP7ir1hsm8WMjNt4OniIaxdZjkN8LrauRNgu-Gi03fC4Sza3AK7VNFgLhASQ9ToXCmqrZD0CEBOcM8Irn9NoSjiUo0Su-qlFeycr12OEkDsFtZTF4QM4SFglcv1q5h0_npIwx0vEurm-C6R5QAcehHtOvMyPM3Tt3DfNHoRimGkbyKStSIUBS8bc-Yq4eEdG',
    location: 'Karen, Nairobi',
    activities: [
      {
        id: 'act-giraffe-elephant',
        hostId: 'host-conservation',
        title: 'VIP Giraffe Centre & Sheldrick Elephant Orphanage Visit',
        category: 'city_tour',
        price: 185,
        duration: '4 hours',
        location: 'Karen, Nairobi',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZqrcMvcUNv1lUhdftIGbBYiGM3PD6OzWA_aaBj2-jYevTM96tQPWGP7ir1hsm8WMjNt4OniIaxdZjkN8LrauRNgu-Gi03fC4Sza3AK7VNFgLhASQ9ToXCmqrZD0CEBOcM8Irn9NoSjiUo0Su-qlFeycr12OEkDsFtZTF4QM4SFglcv1q5h0_npIwx0vEurm-C6R5QAcehHtOvMyPM3Tt3DfNHoRimGkbyKStSIUBS8bc-Yq4eEdG',
        description: 'Exclusive morning visit to hand-feed endangered Rothschild giraffes followed by private keeper presentation at the Daphne Sheldrick Wildlife Trust.',
        rating: 4.95,
        reviewsCount: 156,
        inclusions: ['Chauffeured Transfer', 'Private Wildlife Guide', 'Elephant Trust Adoption Certificate', 'Feed Pellets'],
      },
      {
        id: 'act-nairobi-park',
        hostId: 'host-conservation',
        title: 'Nairobi National Park Sunrise Game Drive',
        category: 'safari',
        price: 150,
        duration: 'Half Day (5 hours)',
        location: 'Nairobi National Park',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC71sjqafAPAB_vLqUkIHlWMhZ8EDg1N8jyORxggTYkmp6XPh3h_2caF83-2Uc-onmsNEqN8V3N-2ckpQO6nRsYQDZ1gGGpgERtuMLKGCRGFp9wo5VZxbmPi1-rm0clLNMSfun_oxL_TalZkCEPJJ_ria0nZ6MPtXrYhEKaFAvIGBYPZMNZZ59b5wcTVlIeEd9pYp3IypeCV7mrSNvCY9n0aJqIZmB3qwhmj13IItRbpHxmr3n925Vc',
        description: 'Spot lions, black rhinos, and leopards framed directly against the dramatic Nairobi city skyline in a private luxury safari cruiser.',
        rating: 4.88,
        reviewsCount: 178,
        inclusions: ['Hotel Pickup & Dropoff', 'High-Spec Pop-Up Roof Cruiser', 'Professional Spotter Guide', 'Binoculars'],
      },
    ],
  },
  {
    id: 'host-craft',
    name: 'Artisanal Kenya Guild & Private Atelier',
    tagline: 'Hand-sculpted Kazuri ceramics, traditional Nyama Choma pairings & private cinema salons',
    category: 'Arts, Cinema & Gastronomy',
    rating: 4.94,
    reviewsCount: 180,
    googleRating: 4.9,
    googleReviewsCount: 390,
    googleReviews: [
      {
        id: 'rev-exp-3',
        author: 'Julianne Hough',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '2 weeks ago',
        text: 'The private ceramic workshop was an artistic revelation. Making our own beads with the artisan women of Karen was pure joy.',
        likes: 17,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@artisanal.kenya',
      googleMaps: 'https://maps.google.com/?q=Kazuri+Beads+Karen',
      website: 'https://artisanalkenya.craft',
      phone: '+254 722 555 GUILD',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxkgzdzJOCmmQ1svsgZ2DaGGR0pPLoiqMCEStUJbRoexxUAsNwjE3P-Hh8EGd4LQNINVfLyEmJjUjLHJ6GFURDjQOIaHNWR3dhJNSnffG0ZSHCqmNorlTgjSV6bTw-E9OBDagfPF7Ys-yHdNiMS2FKPCWNpjspaxWHyKdYV77tTcAeHUjyfXJADXcl_DTw8kunX0kcAT4QVBWR_wOFQqkT0HY-aY6SALmz1rDaLzX0XMQTb7cdJc7N',
    location: 'Westlands & Karen, Nairobi',
    activities: [
      {
        id: 'act-kazuri-beads',
        hostId: 'host-craft',
        title: 'Master Ceramic & Kazuri Beads Studio Workshop',
        category: 'arts_culture',
        price: 65,
        duration: '2.5 hours',
        location: 'Karen Atelier',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxkgzdzJOCmmQ1svsgZ2DaGGR0pPLoiqMCEStUJbRoexxUAsNwjE3P-Hh8EGd4LQNINVfLyEmJjUjLHJ6GFURDjQOIaHNWR3dhJNSnffG0ZSHCqmNorlTgjSV6bTw-E9OBDagfPF7Ys-yHdNiMS2FKPCWNpjspaxWHyKdYV77tTcAeHUjyfXJADXcl_DTw8kunX0kcAT4QVBWR_wOFQqkT0HY-aY6SALmz1rDaLzX0XMQTb7cdJc7N',
        description: 'Hands-on clay sculpting and glazing workshop with master artisans. Take home your own kiln-fired personalized jewelry collection.',
        rating: 4.92,
        reviewsCount: 88,
        inclusions: ['All Clay & Glazing Materials', 'Tea & Coffee Lounge Access', 'Custom Gift Box', 'Shipping Available'],
      },
      {
        id: 'act-cinema-evening',
        hostId: 'host-craft',
        title: 'Private Rooftop Cinema Evening & Champagne',
        category: 'cinema',
        price: 220,
        duration: '3 hours',
        location: 'Westlands Skyline Salon',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJbBdjBN79EBRhQ2sYXvD3x46jj1GXqQ0sRJswcHuZH9ZgN1jkt3Y0djmCZNGpnvCD9R6Rl0RS55QlEFIU_a7R9pMtqP0mHoS_qV-gYkOt9ita1zcdU0WZb6tgpc4GKcTp43qtDHKnWk6QJ2vWU1nBsEHLdXHIilzJKOIABAWYGST9X5NUVNvhtM3nqt6qAGsfnas5Q8DWkEf_Qh37U62ayt9zlWs0t0sOAsyY-GPiz4dDhPKv3_nJ',
        description: 'Private 12-seater 4K laser projection screening lounge with plush reclining velvet loungers, bespoke cocktail sommelier, and truffle popcorn.',
        rating: 4.98,
        reviewsCount: 104,
        inclusions: ['Exclusive Salon Booking', 'Dom Pérignon Flutes', 'Gourmet Truffle Popcorn', 'Bespoke Film Selection'],
      },
    ],
  },
];
