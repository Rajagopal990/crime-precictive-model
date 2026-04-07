export const CRIME_TYPE_OPTIONS = [
  { value: '', label: 'All crime types', code: '' },
  { value: 'IPC-Theft', label: 'Theft', code: '379' },
  { value: 'IPC-Robbery', label: 'Robbery', code: '392' },
  { value: 'IPC-Assault', label: 'Assault', code: '351' },
  { value: 'IPC-Burglary', label: 'Burglary', code: '457' },
  { value: 'Cyber Fraud', label: 'Cyber Fraud', code: '66D' },
  { value: 'Women Harassment', label: 'Women Harassment', code: '354' },
  { value: 'Narcotics Possession', label: 'Narcotics', code: '21-NDPS' },
  { value: 'Road Accident', label: 'Road Accident', code: '279' }
];

export const TIME_SLOT_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 9 PM)' },
  { value: 'night', label: 'Night (9 PM - 12 AM)' },
  { value: 'late-night', label: 'Late Night (12 AM - 6 AM)' }
];

export const TAMIL_NADU_AREAS = [
  {
    value: 'T. Nagar PS',
    label: 'Chennai - T. Nagar',
    policeStation: 'T. Nagar PS',
    address: 'Usman Road, T. Nagar, Chennai',
    latitude: 13.0418,
    longitude: 80.2337
  },
  {
    value: 'Velachery PS',
    label: 'Chennai - Velachery',
    policeStation: 'Velachery PS',
    address: '100 Feet Bypass Road, Velachery, Chennai',
    latitude: 12.9752,
    longitude: 80.2209
  },
  {
    value: 'Anna Nagar PS',
    label: 'Chennai - Anna Nagar',
    policeStation: 'Anna Nagar PS',
    address: '2nd Avenue, Anna Nagar, Chennai',
    latitude: 13.085,
    longitude: 80.2101
  },
  {
    value: 'Coimbatore Central PS',
    label: 'Coimbatore - Central',
    policeStation: 'Coimbatore Central PS',
    address: 'Town Hall, Coimbatore',
    latitude: 11.0168,
    longitude: 76.9558
  },
  {
    value: 'Madurai South PS',
    label: 'Madurai - South',
    policeStation: 'Madurai South PS',
    address: 'Periyar Bus Stand Road, Madurai',
    latitude: 9.9195,
    longitude: 78.1193
  },
  {
    value: 'Trichy Cantonment PS',
    label: 'Tiruchirappalli - Cantonment',
    policeStation: 'Trichy Cantonment PS',
    address: 'Williams Road, Tiruchirappalli',
    latitude: 10.7905,
    longitude: 78.7047
  },
  {
    value: 'Salem Town PS',
    label: 'Salem - Town',
    policeStation: 'Salem Town PS',
    address: 'Five Roads, Salem',
    latitude: 11.6643,
    longitude: 78.146
  },
  {
    value: 'Tirunelveli City PS',
    label: 'Tirunelveli - City',
    policeStation: 'Tirunelveli City PS',
    address: 'Junction Main Road, Tirunelveli',
    latitude: 8.7139,
    longitude: 77.7567
  },
  {
    value: 'Vellore North PS',
    label: 'Vellore - North',
    policeStation: 'Vellore North PS',
    address: 'Katpadi Road, Vellore',
    latitude: 12.9165,
    longitude: 79.1325
  },
  {
    value: 'Thanjavur East PS',
    label: 'Thanjavur - East',
    policeStation: 'Thanjavur East PS',
    address: 'Medical College Road, Thanjavur',
    latitude: 10.7867,
    longitude: 79.1378
  }
];

export const DEFAULT_TAMIL_NADU_AREA = TAMIL_NADU_AREAS[0];
