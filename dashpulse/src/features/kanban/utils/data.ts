import { Endpoints } from "$/types";

export const plantIdEndpoints: Endpoints[] = [
  {
    title: 'Create identification',
    url: '/identification',
    method: 'POST',
    description: 'Submit images to identify plant species and receive possible matches with detailed information.',
    // icon: 'dashboard',
    isActive: true,
  },
  {
    title: 'Health assessment',
    url: '/health-assessment',
    method: 'POST',
    description: 'Upload images to assess plant health, detect diseases, pests, or other issues affecting the plant.',
    // icon: 'health',
    isActive: true,
  },
  {
    title: 'Retrieve identification',
    url: '/identification',
    method: 'GET',
    description: 'Retrieve the results of a previously submitted plant identification request using its unique ID.',
    // icon: 'search',
    isActive: true,
  },
  {
    title: 'Plants search',
    url: '/plants-search',
    method: 'GET',
    description: 'Search for plants in the database using various query parameters like name, family, or genus.',
    // icon: 'search',
    isActive: true,
  },
  {
    title: 'Plant detail',
    url: '/plant-detail',
    method: 'GET',
    description: 'Retrieve detailed information about a specific plant by its unique ID.',
    // icon: 'info',
    isActive: true,
  }
];
