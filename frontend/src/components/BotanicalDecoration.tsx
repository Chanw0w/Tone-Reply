import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';

interface BotanicalDecorationProps {
  size?: number;
  color?: string;
  variant?: 'leaves' | 'berries' | 'mixed';
  style?: ViewStyle;
}

export function BotanicalDecoration({
  size = 60,
  color,
  variant = 'mixed',
  style,
}: BotanicalDecorationProps) {
  const { theme } = useTheme();
  const branchColor = color || theme.botanicalSilhouette;

  return (
    <View style={[styles.container, { width: size, height: size * 1.5 }, style]}>
      {/* Main stem */}
      <View style={[styles.stem, { backgroundColor: branchColor }]} />

      {/* Leaves */}
      {(variant === 'leaves' || variant === 'mixed') && (
        <>
          <View style={[styles.leaf, styles.leafLeft, { backgroundColor: branchColor }]} />
          <View style={[styles.leaf, styles.leafRight, { backgroundColor: branchColor }]} />
          <View style={[styles.leaf, styles.leafLeft, styles.leafLower, { backgroundColor: branchColor }]} />
        </>
      )}

      {/* Berries */}
      {(variant === 'berries' || variant === 'mixed') && (
        <>
          <View style={[styles.berry, styles.berryTop, { backgroundColor: branchColor }]} />
          <View style={[styles.berry, styles.berryMiddle, { backgroundColor: branchColor }]} />
          <View style={[styles.berry, styles.berryBottom, { backgroundColor: branchColor }]} />
        </>
      )}
    </View>
  );
}

interface BranchProps {
  size?: number;
  color?: string;
  direction?: 'left' | 'right';
  style?: ViewStyle;
}

export function Branch({ size = 80, color, direction = 'right', style }: BranchProps) {
  const { theme } = useTheme();
  const branchColor = color || theme.botanicalSilhouette;

  return (
    <View
      style={[
        styles.branchContainer,
        { width: size, height: size * 0.6 },
        direction === 'left' && { transform: [{ scaleX: -1 }] },
        style,
      ]}
    >
      {/* Main branch */}
      <View style={[styles.mainBranch, { backgroundColor: branchColor }]} />

      {/* Small leaves along branch */}
      <View style={[styles.branchLeaf, styles.branchLeaf1, { backgroundColor: branchColor }]} />
      <View style={[styles.branchLeaf, styles.branchLeaf2, { backgroundColor: branchColor }]} />
      <View style={[styles.branchLeaf, styles.branchLeaf3, { backgroundColor: branchColor }]} />
    </View>
  );
}

interface LeafClusterProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function LeafCluster({ size = 50, color, style }: LeafClusterProps) {
  const { theme } = useTheme();
  const leafColor = color || theme.botanicalSilhouette;

  return (
    <View style={[styles.clusterContainer, { width: size, height: size }, style]}>
      <View style={[styles.clusterLeaf, styles.clusterLeaf1, { backgroundColor: leafColor }]} />
      <View style={[styles.clusterLeaf, styles.clusterLeaf2, { backgroundColor: leafColor }]} />
      <View style={[styles.clusterLeaf, styles.clusterLeaf3, { backgroundColor: leafColor }]} />
      <View style={[styles.clusterCenter, { backgroundColor: leafColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  stem: {
    position: 'absolute',
    width: 3,
    height: '100%',
    left: '50%',
    marginLeft: -1.5,
    borderRadius: 1.5,
  },
  leaf: {
    position: 'absolute',
    width: 16,
    height: 8,
    borderRadius: 8,
  },
  leafLeft: {
    left: '20%',
    top: '20%',
    transform: [{ rotate: '-30deg' }],
  },
  leafRight: {
    right: '20%',
    top: '35%',
    transform: [{ rotate: '30deg' }],
  },
  leafLower: {
    top: '55%',
    left: '25%',
  },
  berry: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    left: '50%',
    marginLeft: -5,
  },
  berryTop: {
    top: '10%',
  },
  berryMiddle: {
    top: '45%',
  },
  berryBottom: {
    top: '75%',
  },

  // Branch styles
  branchContainer: {
    position: 'relative',
  },
  mainBranch: {
    position: 'absolute',
    width: '100%',
    height: 3,
    top: '50%',
    marginTop: -1.5,
    borderRadius: 1.5,
  },
  branchLeaf: {
    position: 'absolute',
    width: 12,
    height: 6,
    borderRadius: 6,
    top: '50%',
    marginTop: -3,
  },
  branchLeaf1: {
    left: '20%',
    transform: [{ rotate: '-20deg' }],
  },
  branchLeaf2: {
    left: '50%',
    transform: [{ rotate: '20deg' }],
  },
  branchLeaf3: {
    left: '75%',
    transform: [{ rotate: '-15deg' }],
  },

  // Cluster styles
  clusterContainer: {
    position: 'relative',
  },
  clusterLeaf: {
    position: 'absolute',
    width: 14,
    height: 7,
    borderRadius: 7,
  },
  clusterLeaf1: {
    top: '15%',
    left: '25%',
    transform: [{ rotate: '-45deg' }],
  },
  clusterLeaf2: {
    top: '40%',
    right: '20%',
    transform: [{ rotate: '45deg' }],
  },
  clusterLeaf3: {
    bottom: '20%',
    left: '30%',
    transform: [{ rotate: '-30deg' }],
  },
  clusterCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    left: '50%',
    marginTop: -4,
    marginLeft: -4,
  },
});

export default BotanicalDecoration;
