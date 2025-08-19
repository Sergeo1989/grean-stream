import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { ColorVariant, ComponentSize } from '@/types/enums';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  badgeText?: string;
  variant?: ColorVariant;
  size?: ComponentSize;
  className?: string;
  
  // Legacy props for backwards compatibility
  borderColor?: string;
  iconColor?: string;
}

// Color mapping for different variants
const variantStyles = {
  [ColorVariant.PRIMARY]: {
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
    badge: 'secondary'
  },
  [ColorVariant.SUCCESS]: {
    border: 'border-l-green-500',
    icon: 'text-green-500',
    badge: 'secondary'
  },
  [ColorVariant.WARNING]: {
    border: 'border-l-yellow-500',
    icon: 'text-yellow-500',
    badge: 'outline'
  },
  [ColorVariant.ERROR]: {
    border: 'border-l-red-500',
    icon: 'text-red-500',
    badge: 'destructive'
  },
  [ColorVariant.INFO]: {
    border: 'border-l-blue-400',
    icon: 'text-blue-400',
    badge: 'outline'
  },
  [ColorVariant.SECONDARY]: {
    border: 'border-l-gray-500',
    icon: 'text-gray-500',
    badge: 'secondary'
  },
  [ColorVariant.MUTED]: {
    border: 'border-l-gray-400',
    icon: 'text-gray-400',
    badge: 'outline'
  }
} as const;

// Size mapping for different component sizes
const sizeStyles = {
  [ComponentSize.XS]: {
    card: 'p-3',
    icon: 'text-lg',
    value: 'text-lg',
    label: 'text-xs'
  },
  [ComponentSize.SM]: {
    card: 'p-4',
    icon: 'text-xl',
    value: 'text-xl',
    label: 'text-xs'
  },
  [ComponentSize.MD]: {
    card: 'p-6',
    icon: 'text-2xl',
    value: 'text-2xl',
    label: 'text-sm'
  },
  [ComponentSize.LG]: {
    card: 'p-8',
    icon: 'text-3xl',
    value: 'text-3xl',
    label: 'text-base'
  },
  [ComponentSize.XL]: {
    card: 'p-10',
    icon: 'text-4xl',
    value: 'text-4xl',
    label: 'text-lg'
  }
} as const;

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  unit = '',
  badgeText,
  variant = ColorVariant.SUCCESS,
  size = ComponentSize.MD,
  className,
  // Legacy support
  borderColor,
  iconColor,
}) => {
  const styles = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  
  // Use legacy colors if provided for backwards compatibility
  const finalBorderColor = borderColor || styles.border;
  const finalIconColor = iconColor || styles.icon;

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      // Format numbers with appropriate precision
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      } else if (val % 1 === 0) {
        return val.toString();
      } else {
        return val.toFixed(2);
      }
    }
    return val;
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        'border-l-4',
        finalBorderColor,
        className
      )}
    >
      <CardHeader className={cn('flex-row items-center justify-between space-y-0', sizeStyle.card)}>
        <div className={cn(finalIconColor, sizeStyle.icon)}>
          {icon}
        </div>
        {badgeText && (
          <Badge 
            variant={styles.badge as any}
            className="shrink-0"
          >
            {badgeText}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className={cn('space-y-1', sizeStyle.card, 'pt-0')}>
        <div className={cn('font-bold text-foreground', sizeStyle.value)}>
          {formatValue(value)}
          {unit && <span className="ml-1 text-muted-foreground text-base font-normal">{unit}</span>}
        </div>
        <p className={cn('text-muted-foreground font-medium', sizeStyle.label)}>
          {label}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;

// Export enhanced StatCard with additional variants
export const StatCardVariants = {
  Success: (props: Omit<StatCardProps, 'variant'>) => (
    <StatCard {...props} variant={ColorVariant.SUCCESS} />
  ),
  Warning: (props: Omit<StatCardProps, 'variant'>) => (
    <StatCard {...props} variant={ColorVariant.WARNING} />
  ),
  Error: (props: Omit<StatCardProps, 'variant'>) => (
    <StatCard {...props} variant={ColorVariant.ERROR} />
  ),
  Info: (props: Omit<StatCardProps, 'variant'>) => (
    <StatCard {...props} variant={ColorVariant.INFO} />
  ),
  Primary: (props: Omit<StatCardProps, 'variant'>) => (
    <StatCard {...props} variant={ColorVariant.PRIMARY} />
  )
};

// Type exports
export type { StatCardProps };
export { ColorVariant, ComponentSize };