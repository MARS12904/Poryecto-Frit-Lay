import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Breakpoints, Dimensions, Spacing } from '../constants/theme';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  margin?: keyof typeof Spacing;
  backgroundColor?: string;
  flex?: number;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: keyof typeof Spacing;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  style,
  padding = 'md',
  margin,
  backgroundColor,
  flex,
  direction = 'column',
  justify,
  align,
  wrap,
  gap,
}) => {
  const isSmallScreen = Dimensions.screenWidth < Breakpoints.sm;
  const isMediumScreen = Dimensions.screenWidth >= Breakpoints.sm && Dimensions.screenWidth < Breakpoints.lg;
  const isLargeScreen = Dimensions.screenWidth >= Breakpoints.lg;

  const responsiveStyle: ViewStyle = {
    padding: Spacing[padding],
    ...(margin && { margin: Spacing[margin] }),
    ...(backgroundColor && { backgroundColor }),
    ...(flex !== undefined && { flex }),
    flexDirection: direction,
    ...(justify && { justifyContent: justify }),
    ...(align && { alignItems: align }),
    ...(wrap && { flexWrap: wrap }),
    ...(gap && { gap: Spacing[gap] }),
  };

  // Ajustes específicos para pantallas pequeñas
  if (isSmallScreen) {
    responsiveStyle.paddingHorizontal = Spacing.sm;
    responsiveStyle.paddingVertical = Spacing.sm;
  }

  // Ajustes específicos para pantallas medianas
  if (isMediumScreen) {
    responsiveStyle.paddingHorizontal = Spacing.md;
    responsiveStyle.paddingVertical = Spacing.md;
  }

  // Ajustes específicos para pantallas grandes
  if (isLargeScreen) {
    responsiveStyle.paddingHorizontal = Spacing.lg;
    responsiveStyle.paddingVertical = Spacing.lg;
  }

  return (
    <View style={[responsiveStyle, style]}>
      {children}
    </View>
  );
};

// Componente para contenedores de tarjetas responsive
export const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  margin?: keyof typeof Spacing;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: boolean;
}> = ({
  children,
  style,
  padding = 'md',
  margin = 'sm',
  backgroundColor = '#ffffff',
  borderRadius = 12,
  shadow = true,
}) => {
  const isSmallScreen = Dimensions.screenWidth < Breakpoints.sm;

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    padding: Spacing[padding],
    margin: Spacing[margin],
    ...(shadow && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  };

  // Ajustes para pantallas pequeñas
  if (isSmallScreen) {
    cardStyle.padding = Spacing.sm;
    cardStyle.margin = Spacing.xs;
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

// Componente para botones responsive
export const ResponsiveButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: any;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}> = ({
  children,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const isSmallScreen = Dimensions.screenWidth < Breakpoints.sm;

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#E31E24',
          borderRadius: 12,
        };
      case 'secondary':
        return {
          backgroundColor: '#004B87',
          borderRadius: 12,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#E31E24',
          borderRadius: 12,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    const baseSize = isSmallScreen ? 'sm' : 'md';
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
        };
      case 'medium':
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
        };
      case 'large':
        return {
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
        };
      default:
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
        };
    }
  };

  const buttonStyle: ViewStyle = {
    ...getVariantStyle(),
    ...getSizeStyle(),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <View style={[buttonStyle, style]}>
      {children}
    </View>
  );
};

export default ResponsiveLayout;
