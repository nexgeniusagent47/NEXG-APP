import { TransportProvider, TransportVehicle } from '../types';

export const TRANSPORT_PROVIDERS: TransportProvider[] = [
  {
    id: 'prov-maybach',
    name: 'Apex Maybach & Executive Chauffeur Syndicate',
    tagline: 'Presidential Maybach S680s & Escalade ESVs with certified security chauffeurs',
    rating: 4.99,
    reviewsCount: 384,
    googleRating: 4.9,
    googleReviewsCount: 720,
    googleReviews: [
      {
        id: 'rev-apex-1',
        author: 'Sir Julian Sterling',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '3 days ago',
        text: 'The Maybach S680 runway transfer was flawless. Chauffeur greeted us at tarmac stairs with chilled sparkling San Pellegrino and iced towels. Ultra quiet ride to our villa.',
        likes: 29,
        verifiedGoogleDiner: true,
      },
      {
        id: 'rev-apex-2',
        author: 'Vivienne Westwood Ltd.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '1 week ago',
        text: 'Chauffeur Robert is discreet, courteous, and drives with absolute smoothness. The Escalade was immaculate.',
        likes: 14,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@apexchauffeur.vip',
      googleMaps: 'https://maps.google.com/?q=Apex+Executive+Chauffeur',
      website: 'https://apexmobility.luxury',
      phone: '+1 (800) 555-APEX',
    },
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    fleetCount: 14,
    serviceAreas: 'Airport Runway, Resort District & VIP Terminals',
    vehicles: [
      {
        id: 'veh-maybach',
        providerId: 'prov-maybach',
        name: 'Mercedes-Maybach S-Class 680 Bi-Turbo',
        category: 'limousine',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        passengers: 3,
        luggage: 3,
        pricePerHour: 180,
        priceAirportTransfer: 240,
        features: [
          'Executive Reclining Rear Heated/Cooled Seats',
          'Chilled Champagne Bar & Flutes',
          'Burmester High-End 4D Audio',
          'Private Encrypted Wi-Fi Hotspot'
        ],
        driverRating: 4.99,
      },
      {
        id: 'veh-escalade',
        providerId: 'prov-maybach',
        name: 'Cadillac Escalade Platinum ESV Extended',
        category: 'suv',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        passengers: 6,
        luggage: 6,
        pricePerHour: 160,
        priceAirportTransfer: 210,
        features: [
          'Curved 38-inch OLED Studio Display',
          'Refrigerated Center Console with Fresh Beverages',
          'Panoramic Triple-Pane Acoustic Skylight',
          'Valet Baggage Assistance Included'
        ],
        driverRating: 4.96,
      },
    ],
  },
  {
    id: 'prov-rolls',
    name: 'Bespoke Rolls-Royce Fleet & Royal Valet',
    tagline: 'Hand-crafted Ghost & Cullinan motorcars with British white-glove chauffeurs',
    rating: 5.0,
    reviewsCount: 290,
    googleRating: 5.0,
    googleReviewsCount: 540,
    googleReviews: [
      {
        id: 'rev-rolls-1',
        author: 'Lord Harrison Blake',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '5 days ago',
        text: 'Riding under the Starlight Headliner in the Ghost was a royal experience. The chauffeur was impeccably suited and arrived 15 minutes ahead of schedule.',
        likes: 38,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@rollsroyce.bespokefleet',
      googleMaps: 'https://maps.google.com/?q=Bespoke+Rolls+Royce+Fleet',
      website: 'https://bespokemotorcars.vip',
      phone: '+1 (800) 555-ROLLS',
    },
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    fleetCount: 8,
    serviceAreas: 'Resort Villas, Golf Clubs & Grand Estates',
    vehicles: [
      {
        id: 'veh-rolls-ghost',
        providerId: 'prov-rolls',
        name: 'Rolls-Royce Ghost Extended Wheelbase',
        category: 'luxury_sedan',
        image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80',
        passengers: 3,
        luggage: 4,
        pricePerHour: 320,
        priceAirportTransfer: 420,
        features: [
          'Handmade Fiber-Optic Starlight Headliner',
          'Whisper-Quiet Double-Glazed Acoustic Cabin',
          'Deep-Pile Lambswool Floor Rugs',
          'Dedicated Attired White-Glove Chauffeur'
        ],
        driverRating: 5.0,
      },
    ],
  },
  {
    id: 'prov-aerolux',
    name: 'AeroLux Helipad Transfers & Coastal Aviation',
    tagline: 'Twin-engine luxury turbine helicopters for instant island & runway transit',
    rating: 4.98,
    reviewsCount: 195,
    googleRating: 4.9,
    googleReviewsCount: 380,
    googleReviews: [
      {
        id: 'rev-aero-1',
        author: 'Captain Arthur Finch',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        relativeTime: '1 week ago',
        text: 'Transferred directly from private jet to the resort villa helipad in 12 minutes flat. The aerial view of the coastline was breathtaking.',
        likes: 42,
        verifiedGoogleDiner: true,
      }
    ],
    socials: {
      instagram: '@aerolux.aviation',
      googleMaps: 'https://maps.google.com/?q=AeroLux+Helipad+Terminal',
      website: 'https://aerolux.aero',
      phone: '+1 (800) 555-HELI',
    },
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    fleetCount: 6,
    serviceAreas: 'International Airport Tarmac & Resort Helipads',
    vehicles: [
      {
        id: 'veh-helicopter',
        providerId: 'prov-aerolux',
        name: 'Airbus ACH130 Luxury Helicopter Transfer',
        category: 'helicopter',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        passengers: 5,
        luggage: 4,
        pricePerHour: 1200,
        priceAirportTransfer: 1450,
        features: [
          'Direct Heli-Pad to Resort Villa Touchdown',
          'Noise-Cancelling Active Bose Aviation Headsets',
          'Panoramic High-Visibility Fenestron Cabin',
          'Fast-Track Runway Jet Ramp Access'
        ],
        driverRating: 5.0,
      },
    ],
  },
];

export const TRANSPORT_VEHICLES: TransportVehicle[] = TRANSPORT_PROVIDERS.flatMap((p) => p.vehicles);
