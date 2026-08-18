import React from 'react';
import SectionHeader from './SectionHeader';
import TripCard from './TripCard';

export default function TrendingPackagesSection({ trips, navigation }) {
  return (
    <>
      <SectionHeader title="Top Handcrafted Packages" />
      {trips.slice(0, 4).map((trip) => (
        <TripCard
          key={trip._id || trip.title}
          trip={trip}
          onPress={() => navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })}
        />
      ))}
    </>
  );
}
