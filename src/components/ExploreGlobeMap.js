import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import { Compass, MapPin, Plus, Minus, LocateFixed } from 'lucide-react-native';
import useUserLocation from '../hooks/useUserLocation';
import useMapHeading from '../hooks/useMapHeading';
import { TRENDING_DESTINATIONS } from '../data/trendingDestinations';
import { getDistanceKm } from '../utils/geo';
import { COLORS, SPACING, FONTS, RADIUS, SHADOW } from '../theme';

const CAMERA_ANIM_MS = 220;
const MIN_ZOOM = 2;
const MAX_ZOOM = 14;
const DEFAULT_ZOOM = 4;

export default function ExploreGlobeMap({ onSelectDestination, onShowList }) {
  const { coords, status } = useUserLocation();
  const heading = useMapHeading();

  const mapRef = useRef(null);
  const zoomRef = useRef(DEFAULT_ZOOM);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selected, setSelected] = useState(null);

  const points = useMemo(() => {
    if (!coords) return [];
    return TRENDING_DESTINATIONS.map((dest) => ({
      ...dest,
      distanceKm: getDistanceKm(coords.lat, coords.lng, dest.lat, dest.lng),
    }));
  }, [coords]);

  // Compass-locked camera: always centered on the user, rotating with their
  // heading (like turn-by-turn navigation mode), throttled + smoothed
  // upstream in useMapHeading so this animates rather than snaps.
  useEffect(() => {
    if (!coords || !mapRef.current) return;
    mapRef.current.animateCamera(
      {
        center: { latitude: coords.lat, longitude: coords.lng },
        heading,
        pitch: 0,
        zoom: zoomRef.current,
      },
      { duration: CAMERA_ANIM_MS }
    );
  }, [heading, coords]);

  const applyZoom = (delta) => {
    if (!coords || !mapRef.current) return;
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current + delta));
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
    mapRef.current.animateCamera(
      {
        center: { latitude: coords.lat, longitude: coords.lng },
        heading,
        pitch: 0,
        zoom: nextZoom,
      },
      { duration: 180 }
    );
  };

  if (status === 'loading') {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={COLORS.white} />
        <Text style={styles.centerStateText}>Locating you…</Text>
      </View>
    );
  }

  if (status === 'denied' || status === 'error') {
    return (
      <View style={styles.centerState}>
        <LocateFixed size={28} color="rgba(255,255,255,0.6)" />
        <Text style={styles.centerStateText}>
          {status === 'denied'
            ? 'Location access is off. Enable it in Settings to explore the world map.'
            : "Couldn't get your location. Try again shortly."}
        </Text>
        <TouchableOpacity style={styles.fallbackBtn} onPress={onShowList}>
          <Text style={styles.fallbackBtnText}>Browse the list instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ClusteredMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialCamera={{
          center: { latitude: coords.lat, longitude: coords.lng },
          heading,
          pitch: 0,
          zoom: DEFAULT_ZOOM,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        clusterColor={COLORS.ink}
        clusterTextColor={COLORS.white}
        radius={60}
      >
        {points.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.lat, longitude: point.lng }}
            onPress={() => setSelected(point)}
          >
            <View style={styles.pin}>
              <MapPin size={14} color={COLORS.white} />
            </View>
          </Marker>
        ))}
      </ClusteredMapView>

      <View style={styles.headerOverlay}>
        <View style={styles.headingBadge}>
          <Compass size={14} color={COLORS.white} />
          <Text style={styles.headingBadgeText}>{Math.round(heading)}°</Text>
        </View>
        <TouchableOpacity style={styles.listToggle} onPress={onShowList}>
          <Text style={styles.listToggleText}>View as list</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => applyZoom(1)}>
          <Plus size={18} color={COLORS.ink} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => applyZoom(-1)}>
          <Minus size={18} color={COLORS.ink} />
        </TouchableOpacity>
      </View>

      {selected && (
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardClose} onPress={() => setSelected(null)}>
            <Text style={styles.cardCloseText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>{selected.name}</Text>
          <Text style={styles.cardMeta}>
            {selected.tag} · {Math.round(selected.distanceKm).toLocaleString()} km away
          </Text>
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => onSelectDestination && onSelectDestination(selected)}
          >
            <Text style={styles.cardBtnText}>View Trips</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.ink,
  },
  centerStateText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  fallbackBtn: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  fallbackBtnText: {
    fontFamily: FONTS.body,
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.white,
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(22,19,17,0.85)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
  },
  headingBadgeText: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.white,
  },
  listToggle: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(22,19,17,0.85)',
  },
  listToggleText: {
    fontFamily: FONTS.body,
    fontWeight: '600',
    fontSize: 12,
    color: COLORS.white,
  },
  zoomControls: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.xl * 2,
    gap: SPACING.xs,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  card: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    bottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    ...SHADOW,
  },
  cardClose: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.sm,
    padding: SPACING.xs,
  },
  cardCloseText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  cardTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.ink,
  },
  cardMeta: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  cardBtn: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  cardBtnText: {
    fontFamily: FONTS.body,
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.white,
  },
});
