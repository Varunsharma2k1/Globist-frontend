import { GST_RATE } from '../../../data/agencyBookings';

const DAY = 24 * 60 * 60 * 1000;
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

const hashId = (seed = '') => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const splitGst = (total) => {
  const subtotal = Math.round(total / (1 + GST_RATE));
  return { subtotal, gst: total - subtotal, total };
};

/**
 * A traveller's booking in the shape the Invoice screen expects. Built from a
 * real booking (`booking` from the API) or, for placeholder data, from a
 * catalogue trip (`trip`) with made-up but stable travellers / dates / payment.
 */
export function buildTravelerBooking({ user, trip, booking, index = 0 }) {
  const pkgTrip = booking?.trip || trip;
  const h = hashId(`${user?._id}-${pkgTrip?._id}`);
  const travelers = booking?.travelersCount || 1 + (h % 3);
  const ratePerPerson = pkgTrip?.price || 0;
  const total = booking?.totalPrice ?? Math.round(ratePerPerson * travelers * (1 + GST_RATE));

  const fallbackTravel = Date.now() + (index + 1) * 30 * DAY;
  const slot = pkgTrip?.nextSlot ? new Date(pkgTrip.nextSlot).getTime() : 0;

  return {
    _id: booking?._id || `TT-BK-${10400 + (h % 600)}`,
    invoiceNo: `TT-INV-${10400 + (h % 600)}`,
    package: {
      name: pkgTrip?.title || 'Trip package',
      region: pkgTrip?.location || '',
      duration: parseInt(pkgTrip?.duration, 10) || null,
    },
    agencyName: pkgTrip?.agency?.name || 'Triptape partner agency',
    traveler: { name: user?.name || 'Traveller', email: user?.email || '', phone: '', city: '' },
    travelers,
    occupancy: booking?.occupancy || (travelers > 1 ? 'double' : 'single'),
    ratePerPerson,
    travelDate: booking?.startDate || iso(slot > Date.now() ? slot : fallbackTravel),
    bookedOn: booking?.createdAt?.slice(0, 10) || iso(Date.now() - (index + 1) * 6 * DAY),
    paymentMethod: booking?.paymentMethod || ['UPI', 'Credit Card', 'Net Banking'][h % 3],
    status: booking?.status === 'cancelled' ? 'refunded' : 'paid',
    ...splitGst(total),
    trip: pkgTrip,
  };
}
