import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../constants/theme';

interface ProductImageProps {
  source: { uri: string } | number;
  style?: ImageStyle;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackColor?: string;
  showFallback?: boolean;
}

export default function ProductImage({
  source,
  style,
  fallbackIcon = 'image-outline',
  fallbackColor = Colors.light.textLight,
  showFallback = true,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError && showFallback) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Ionicons 
          name={fallbackIcon} 
          size={style?.width ? (style.width as number) * 0.4 : 40} 
          color={fallbackColor} 
        />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[styles.image, style]}
      onError={handleImageError}
      onLoad={handleImageLoad}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: BorderRadius.md,
  },
  fallbackContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
