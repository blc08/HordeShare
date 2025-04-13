export const seedingTorrents_example = [
    {
        id: 1,
        name: 'Ubuntu 22.04 LTS Desktop',
        size: '3.5 GB',
        sizeBytes: 3758096384,
        uploadedDate: new Date('2025-03-15'),
        seedTime: 120,
        seedTimeRequired: 168,
        seedProgress: 71,
        seedRatio: 2.5,
        ratioRequired: 1.0,
        status: 'Seeding',
        peers: 15,
        category: 'Operating Systems'
      },
      {
        id: 2,
        name: 'Debian 12.1.0 Full Install',
        size: '4.7 GB',
        sizeBytes: 5045485977,
        uploadedDate: new Date('2025-03-28'),
        seedTime: 50,
        seedTimeRequired: 168,
        seedProgress: 30,
        seedRatio: 0.6,
        ratioRequired: 1.0,
        status: 'Seeding',
        peers: 8,
        category: 'Operating Systems'
      },
      {
        id: 3,
        name: 'The Open Source Documentary',
        size: '1.2 GB',
        sizeBytes: 1288490188,
        uploadedDate: new Date('2025-04-02'),
        seedTime: 20,
        seedTimeRequired: 72,
        seedProgress: 28,
        seedRatio: 0.3,
        ratioRequired: 1.0,
        status: 'Seeding',
        peers: 3,
        category: 'Documentary'
      }
];
export const warningTorrents_example = [
  {
    id: 4,
    name: 'Python Programming Course 2025',
    size: '8.1 GB',
    sizeBytes: 8695133388,
    uploadedDate: new Date('2025-02-20'),
    seedTime: 10,
    seedTimeRequired: 168,
    seedProgress: 6,
    seedRatio: 0.2,
    ratioRequired: 1.0,
    status: 'Warning',
    peers: 12,
    category: 'Education',
    warningDate: new Date('2025-02-27')
  },
  {
    id: 5,
    name: 'LibreOffice Complete Collection',
    size: '2.3 GB',
    sizeBytes: 2469606195,
    uploadedDate: new Date('2025-03-10'),
    seedTime: 30,
    seedTimeRequired: 120,
    seedProgress: 25,
    seedRatio: 0.4,
    ratioRequired: 1.0,
    status: 'Warning',
    peers: 5,
    category: 'Software',
    warningDate: new Date('2025-03-25')
  }
];
export const completedTorrents_example = [
  {
    id: 6,
    name: 'Blender 4.0 Complete Guide',
    size: '5.6 GB',
    sizeBytes: 6012954214,
    uploadedDate: new Date('2025-01-15'),
    seedTime: 200,
    seedTimeRequired: 168,
    seedProgress: 100,
    seedRatio: 2.8,
    ratioRequired: 1.0,
    status: 'Complete',
    peers: 0,
    category: 'Education'
  },
  {
    id: 7,
    name: 'Arch Linux 2025.03',
    size: '0.8 GB',
    sizeBytes: 858993459,
    uploadedDate: new Date('2025-03-05'),
    seedTime: 180,
    seedTimeRequired: 120,
    seedProgress: 100,
    seedRatio: 3.2,
    ratioRequired: 1.0,
    status: 'Complete',
    peers: 2,
    category: 'Operating Systems'
  }
]