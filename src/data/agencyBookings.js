/* eslint-disable max-lines -- dummy data table */
/**
 * Dummy bookings that travellers have made on an agency's Himalayan trek
 * packages (see agencyPackages.js). Frontend-only for now — swap for an API
 * call when the backend can return an agency's bookings.
 */
import { AGENCY_PACKAGES } from './agencyPackages';

export const GST_RATE = 0.05; // GST on tour packages

const b = (
  id,
  packageId,
  traveler,
  travelers,
  occupancy,
  ratePerPerson,
  travelDate,
  bookedOn,
  method,
  status
) => ({
  _id: id,
  packageId,
  traveler,
  travelers,
  occupancy,
  ratePerPerson,
  travelDate,
  bookedOn,
  paymentMethod: method,
  status,
});

export const AGENCY_BOOKINGS = [
  b(
    'TT-BK-10482',
    'pkg-kedarkantha',
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@gmail.com',
      phone: '+91 98450 11234',
      city: 'Bengaluru',
    },
    2,
    'double',
    8900,
    '2026-12-20',
    '2026-10-24',
    'UPI',
    'paid'
  ),
  b(
    'TT-BK-10479',
    'pkg-triund',
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@outlook.com',
      phone: '+91 99110 45678',
      city: 'New Delhi',
    },
    4,
    'quad',
    3000,
    '2026-11-14',
    '2026-10-22',
    'Credit Card',
    'paid'
  ),
  b(
    'TT-BK-10471',
    'pkg-roopkund',
    { name: 'Meera Nair', email: 'meera.nair@gmail.com', phone: '+91 98470 22981', city: 'Kochi' },
    1,
    'single',
    20600,
    '2027-05-22',
    '2026-10-20',
    'Net Banking',
    'paid'
  ),
  b(
    'TT-BK-10466',
    'pkg-hampta-pass',
    {
      name: 'Karan Malhotra',
      email: 'karan.m@gmail.com',
      phone: '+91 98765 33120',
      city: 'Gurugram',
    },
    3,
    'triple',
    10300,
    '2027-06-14',
    '2026-10-18',
    'UPI',
    'pending'
  ),
  b(
    'TT-BK-10458',
    'pkg-valley-of-flowers',
    { name: 'Sneha Kulkarni', email: 'sneha.k@yahoo.com', phone: '+91 97300 88421', city: 'Pune' },
    2,
    'double',
    13000,
    '2027-07-08',
    '2026-10-15',
    'Debit Card',
    'paid'
  ),
  b(
    'TT-BK-10451',
    'pkg-kedarkantha',
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      phone: '+91 98110 67890',
      city: 'Chandigarh',
    },
    5,
    'quad',
    7500,
    '2026-12-20',
    '2026-10-12',
    'UPI',
    'paid'
  ),
  b(
    'TT-BK-10447',
    'pkg-triund',
    {
      name: 'Isha Kapoor',
      email: 'isha.kapoor@gmail.com',
      phone: '+91 99710 54321',
      city: 'Mumbai',
    },
    2,
    'double',
    3500,
    '2026-11-14',
    '2026-10-09',
    'UPI',
    'refunded'
  ),
  b(
    'TT-BK-10439',
    'pkg-roopkund',
    {
      name: 'Aditya Rao',
      email: 'aditya.rao@gmail.com',
      phone: '+91 98860 12345',
      city: 'Hyderabad',
    },
    2,
    'double',
    14800,
    '2027-05-22',
    '2026-10-05',
    'Credit Card',
    'paid'
  ),
  b(
    'TT-BK-10431',
    'pkg-hampta-pass',
    {
      name: 'Pooja Sharma',
      email: 'pooja.sharma@gmail.com',
      phone: '+91 98180 77654',
      city: 'Jaipur',
    },
    2,
    'double',
    11200,
    '2027-06-14',
    '2026-10-02',
    'Net Banking',
    'paid'
  ),
  b(
    'TT-BK-10424',
    'pkg-valley-of-flowers',
    {
      name: 'Nikhil Joshi',
      email: 'nikhil.joshi@gmail.com',
      phone: '+91 98230 90123',
      city: 'Nagpur',
    },
    1,
    'single',
    18200,
    '2027-07-08',
    '2026-09-28',
    'UPI',
    'pending'
  ),
];

const packageById = (id) => AGENCY_PACKAGES.find((p) => p._id === id);

/** Booking + its package, subtotal, GST and total (₹). */
export function withInvoice(booking) {
  const subtotal = booking.ratePerPerson * booking.travelers;
  const gst = Math.round(subtotal * GST_RATE);
  return {
    ...booking,
    package: packageById(booking.packageId),
    invoiceNo: booking._id.replace('BK', 'INV'),
    subtotal,
    gst,
    total: subtotal + gst,
  };
}

export const getAgencyBookings = () => AGENCY_BOOKINGS.map(withInvoice);
export const getAgencyBooking = (id) => getAgencyBookings().find((x) => x._id === id) || null;
