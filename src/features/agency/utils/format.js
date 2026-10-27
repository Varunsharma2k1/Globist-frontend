export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatINR = (n) => `₹${n.toLocaleString('en-IN')}`;

// Booking payment status → Tag label/variant.
export const STATUS_TAG = {
  paid: { label: 'PAID', variant: 'success' },
  pending: { label: 'PENDING', variant: 'primary' },
  refunded: { label: 'REFUNDED', variant: 'default' },
};
