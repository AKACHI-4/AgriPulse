import { Endpoints } from "$/types";

export const modelEndpoints: Endpoints[] = [
  {
    title: 'Create Identification',
    url: 'identification',
    method: 'POST',
    description: 'Submit images to identify plant species and receive possible matches with detailed information.',
    // icon: 'dashboard',
    isActive: true,
    source: 'plant.id',
  },
  {
    title: 'Health Assessment',
    url: 'health_assessment',
    method: 'POST',
    description: 'Upload images to assess plant health, detect diseases, pests, or other issues affecting the plant.',
    // icon: 'health',
    isActive: true,
    source: 'plant.id',
  },
  {
    title: 'Disease Detection',
    url: '/predict/disease',
    method: 'POST',
    description: 'Submit leaf images to detect and classify plant diseases using deep learning models.',
    isActive: true,
    source: 'Development Team',
  },
  {
    title: 'Pest Detection',
    url: '/predict/pest',
    method: 'POST',
    description: 'Submit crop images to identify pest infestations and determine the type of pest present.',
    isActive: true,
    source: 'Development Team',
  },
  {
    title: 'Yield Prediction',
    url: '/predict/yield',
    method: 'POST',
    description: 'Submit relevant crop parameters to estimate potential yield using a trained ML model.',
    isActive: true,
    source: 'Development Team',
  },
  // {
  //   title: 'Plants search',
  //   url: 'kb/plants/name_search',
  //   method: 'GET',
  //   description: 'Search for plants in the database using various query parameters like name, family, or genus.',
  //   // icon: 'search',
  //   isActive: true,
  //   source: 'plant.id',
  // },
  // {
  //   title: 'Plant detail',
  //   url: 'plant-detail',
  //   method: 'GET',
  //   description: 'Retrieve detailed information about a specific plant by its unique ID.',
  //   // icon: 'info',
  //   isActive: true,
  // }
];
