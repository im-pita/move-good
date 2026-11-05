import { SamplePile } from '../types';

export const SAMPLE_PILES: SamplePile[] = [
  {
    id: 'pile-dorm-cleanout',
    title: 'Dorm Room Cleanout',
    subtitle: '5 items · Bedding, appliances & essentials',
    description: 'Typical end-of-semester mix: a space heater, soft fleece blanket, hanger bundle, sneakers, and unopened spray cleaner.',
    // Uses the sample photo from user attachment
    imageUrl: '/assets/aistudio/Screenshot_2026-11-02_at_12.22.40_AM_2e6f2640.png',
    items: [
      {
        id: 'item-1',
        category: 'heater',
        label: 'Space heater',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Compact ceramic space heater. Cord looks intact.',
        needsConditionCheck: true,
        conditionCheckQuestion: 'Does the heater work, with no frayed wires or damage?',
        isConditionConfirmed: false
      },
      {
        id: 'item-2',
        category: 'blanket',
        label: 'Fleece blanket',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Navy blue fleece throw, clean and washed.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      },
      {
        id: 'item-3',
        category: 'hangers',
        label: 'Plastic hangers',
        quantity: 12,
        condition: 'good',
        confidence: 'high',
        note: 'Standard white plastic coat hangers.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      },
      {
        id: 'item-4',
        category: 'shoes',
        label: 'Running shoes',
        quantity: 1,
        condition: 'worn',
        confidence: 'medium',
        note: 'Men’s athletic trainers, light sole wear.',
        needsConditionCheck: true,
        conditionCheckQuestion: 'Are the running shoes clean and in good wearable condition?',
        isConditionConfirmed: false
      },
      {
        id: 'item-5',
        category: 'cleaning_supplies',
        label: 'All-purpose cleaner',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Unopened antibacterial spray bottle.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      }
    ]
  },
  {
    id: 'pile-apartment-moving',
    title: 'Off-Campus Apartment Pack',
    subtitle: '4 items · Laundry hampers, box fan & winter duvet',
    description: 'Post-graduation packing haul with dorm storage hampers, 20 hangers, and an oscillating desk fan.',
    imageUrl: '/assets/aistudio/Screenshot_2026-11-02_at_12.22.10_AM_62a83c61.png',
    items: [
      {
        id: 'item-apt-1',
        category: 'fan',
        label: 'Oscillating desk fan',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: '3-speed white table fan, working cord.',
        needsConditionCheck: true,
        conditionCheckQuestion: 'Does the desk fan spin freely and power on safely?',
        isConditionConfirmed: false
      },
      {
        id: 'item-apt-2',
        category: 'laundry_basket',
        label: 'Plastic laundry hamper',
        quantity: 2,
        condition: 'good',
        confidence: 'high',
        note: 'White perforated laundry baskets, clean condition.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      },
      {
        id: 'item-apt-3',
        category: 'blanket',
        label: 'Twin winter comforter',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Heavy grey duvet, recently washed.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      },
      {
        id: 'item-apt-4',
        category: 'hangers',
        label: 'Heavy duty wooden hangers',
        quantity: 8,
        condition: 'good',
        confidence: 'high',
        note: 'Wooden suit hangers.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      }
    ]
  },
  {
    id: 'pile-underbed-storage',
    title: 'Closet & Bed Storage Clearout',
    subtitle: '3 items · Blankets, sneakers & storage',
    description: 'Winter gear and closet essentials that incoming students or local shelters can put straight to use.',
    imageUrl: '/assets/aistudio/Screenshot_2026-11-02_at_12.22.22_AM_f391358c.png',
    items: [
      {
        id: 'item-ub-1',
        category: 'blanket',
        label: 'Wool blend throw',
        quantity: 2,
        condition: 'good',
        confidence: 'high',
        note: 'Warm plaid wool blankets in clean condition.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      },
      {
        id: 'item-ub-2',
        category: 'shoes',
        label: 'Canvas slip-on sneakers',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Size 8 canvas sneakers, gently worn.',
        needsConditionCheck: true,
        conditionCheckQuestion: 'Are the sneakers clean and free of holes or tears?',
        isConditionConfirmed: false
      },
      {
        id: 'item-ub-3',
        category: 'laundry_basket',
        label: 'Collapsible mesh hamper',
        quantity: 1,
        condition: 'good',
        confidence: 'high',
        note: 'Foldable pop-up mesh hamper.',
        needsConditionCheck: false,
        isConditionConfirmed: true
      }
    ]
  }
];
