import { Platform } from 'react-native';
import { Feather as FeatherNative } from '@expo/vector-icons';
import React from 'react';

// Feather SVG icons from react-icons
import * as FeatherIcons from 'react-icons/fe';

// Map Feather icon names to react-icons equivalents
const iconMapping = {
  'shopping-bag': 'ShoppingBag',
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight',
  'arrow-right': 'ArrowRight',
  'arrow-left': 'ArrowLeft',
  'check-circle': 'CheckCircle',
  'check': 'Check',
  'lock': 'Lock',
  'tag': 'Tag',
  'plus': 'Plus',
  'minus': 'Minus',
  'menu': 'Menu',
  'x': 'X',
  'settings': 'Settings',
  'user': 'User',
  'mail': 'Mail',
  'phone': 'Phone',
  'home': 'Home',
  'star': 'Star',
  'heart': 'Heart',
  'search': 'Search',
  'bell': 'Bell',
  'camera': 'Camera',
  'map': 'Map',
  'clock': 'Clock',
  'calendar': 'Calendar',
  'edit': 'Edit',
  'trash-2': 'Trash2',
  'download': 'Download',
  'upload': 'Upload',
  'share-2': 'Share2',
  'eye': 'Eye',
  'eye-off': 'EyeOff',
  'copy': 'Copy',
  'info': 'Info',
  'alert-circle': 'AlertCircle',
  'loader': 'Loader',
};

export const IconWrapper = ({ name, size = 24, color = '#000', ...props }) => {
  if (Platform.OS === 'web') {
    // Use react-icons on web
    const mappedName = iconMapping[name];
    const iconName = mappedName || name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const IconComponent = FeatherIcons[`Fe${iconName}`];
    
    if (IconComponent) {
      return (
        <IconComponent
          size={size}
          color={color}
          style={{ display: 'inline-flex', verticalAlign: 'middle' }}
          {...props}
        />
      );
    }
    
    // Fallback for unmapped icons
    return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  }
  
  // Use Feather on native platforms
  return (
    <FeatherNative
      name={name}
      size={size}
      color={color}
      {...props}
    />
  );
};

// Default export for convenience
export default IconWrapper;

