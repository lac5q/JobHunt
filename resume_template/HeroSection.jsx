import React, { useEffect, useState } from 'react';

// Design Tokens - Extract these to a separate file for a design system
const tokens = {
  colors: {
    background: '#fafafa',      // zinc-50
    cardBg: '#ffffff',
    primary: '#18181b',         // zinc-900
    secondary: '#71717a',       // zinc-500
    muted: '#a1a1aa',           // zinc-400
    border: '#e4e4e7',          // zinc-200
    borderHover: '#18181b',     // zinc-900
    divider: '#f4f4f5',         // zinc-100
  },
  typography: {
    headingFont: '"Playfair Display", serif',
    bodyFont: '"Lora", serif',
    heading: { size: '2.25rem', weight: 500, letterSpacing: '0.025em' },
    subheading: { size: '1.375rem', weight: 500, letterSpacing: 'normal' },
    body: { size: '0.9375rem', weight: 400, lineHeight: 1.625 },
  },
  animation: {
    duration: '0.8s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    staggerDelay: 0.1,
  },
  spacing: {
    cardPadding: '2.5rem 3rem',
    cardPaddingMobile: '2rem',
  },
};

// Reusable Animated Container
const AnimatedItem = ({ children, index, isVisible, style = {} }) => {
  const delay = index * tokens.animation.staggerDelay;
  
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity ${tokens.animation.duration} ${tokens.animation.easing} ${delay}s, 
                     transform ${tokens.animation.duration} ${tokens.animation.easing} ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Outline Card Component
const OutlineCard = ({ children, className = '', hover = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: tokens.colors.cardBg,
        border: `1px solid ${isHovered && hover ? tokens.colors.borderHover : tokens.colors.border}`,
        borderRadius: '2px',
        transform: isHovered && hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered && hover 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
          : '0 1px 3px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.3s ease',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// Social Icon Button
const SocialButton = ({ icon, href = '#', label }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const icons = {
    mail: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    location: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  };

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0.5rem',
        color: isHovered ? tokens.colors.primary : tokens.colors.muted,
        border: `1px solid ${isHovered ? tokens.colors.border : 'transparent'}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        cursor: href === '#' ? 'default' : 'pointer',
      }}
    >
      {icons[icon]}
    </a>
  );
};

// Profile Image with Grayscale Hover Effect
const ProfileImage = ({ src, alt, size = 160 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isHovered ? 'grayscale(0)' : 'grayscale(100%)',
          transition: 'filter 0.5s ease',
        }}
      />
    </div>
  );
};

// Main Hero Section Component
export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - replace with props for reusability
  const heroData = {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    name: 'Luis Calderon',
    title: 'Product Leader | PLG Expert | AI Innovation',
    bio: {
      intro: 'Data-driven product leader',
      highlights: '$900M TurboTax, $800M Ancestry, and global eBay marketplace',
      current: 'Currently CEO of $3M e-commerce business.',
      expertise: 'Product-Led Growth, AI/ML products, and conversion optimization',
    },
    socials: [
      { icon: 'mail', href: 'mailto:luis@example.com', label: 'Email' },
      { icon: 'linkedin', href: '#', label: 'LinkedIn' },
      { icon: 'location', href: '#', label: 'Location' },
    ],
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: tokens.colors.background,
      fontFamily: tokens.typography.bodyFont,
      padding: '2rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lora:wght@400;500&display=swap" 
        rel="stylesheet" 
      />
      
      <OutlineCard>
        <div style={{ 
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          maxWidth: '32rem',
        }}>
          
          {/* 1. Profile Image */}
          <AnimatedItem index={0} isVisible={isVisible}>
            <ProfileImage 
              src={heroData.image} 
              alt={heroData.name}
              size={160}
            />
          </AnimatedItem>

          {/* 2. Name & Title Stack */}
          <AnimatedItem index={1} isVisible={isVisible}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Heading */}
              <h1 style={{
                fontFamily: tokens.typography.headingFont,
                fontSize: tokens.typography.heading.size,
                fontWeight: tokens.typography.heading.weight,
                letterSpacing: tokens.typography.heading.letterSpacing,
                color: tokens.colors.primary,
                margin: 0,
                lineHeight: 1.2,
              }}>
                {heroData.name}
              </h1>
              
              {/* Subheading */}
              <h2 style={{
                fontFamily: tokens.typography.headingFont,
                fontSize: tokens.typography.subheading.size,
                fontWeight: tokens.typography.subheading.weight,
                color: tokens.colors.secondary,
                margin: 0,
                lineHeight: 1.4,
              }}>
                {heroData.title}
              </h2>
            </div>
          </AnimatedItem>

          {/* 3. Social Icons */}
          <AnimatedItem index={2} isVisible={isVisible}>
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
              {heroData.socials.map((social, i) => (
                <SocialButton key={i} {...social} />
              ))}
            </div>
          </AnimatedItem>

          {/* 4. Bio Section */}
          <AnimatedItem index={3} isVisible={isVisible}>
            <div style={{
              paddingTop: '1.5rem',
              borderTop: `1px solid ${tokens.colors.divider}`,
              width: '100%',
            }}>
              <p style={{
                fontSize: tokens.typography.body.size,
                lineHeight: tokens.typography.body.lineHeight,
                color: tokens.colors.secondary,
                margin: 0,
              }}>
                <span style={{ color: tokens.colors.primary, fontWeight: 500 }}>
                  {heroData.bio.intro}
                </span>
                {' '}with proven track record across{' '}
                <span style={{ color: tokens.colors.primary, fontWeight: 500 }}>
                  {heroData.bio.highlights}
                </span>
                . {heroData.bio.current} Deep expertise in{' '}
                <span style={{ color: tokens.colors.primary, fontWeight: 500 }}>
                  {heroData.bio.expertise}
                </span>
                .
              </p>
            </div>
          </AnimatedItem>

        </div>
      </OutlineCard>
    </div>
  );
}
