import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View, StyleSheet, Animated, Easing, Dimensions, Text, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path, Ellipse, Defs, RadialGradient, Stop,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const GOLD       = '#C6A15B';
const GOLD_LIGHT = '#F5D38A';
const GOLD_DARK  = '#9B7D47';
const BLACK      = '#000000';
const NUM_BEANS  = 40; // Heavy rain

// ─── Helpers ─────────────────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }

// ─── Small Coffee Bean SVG (for rain) ────────────────────────────────────
function BeanSVG({ size = 28 }) {
  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 40 52">
      <Defs>
        <RadialGradient id={`rb${size}`} cx="45%" cy="38%" r="60%">
          <Stop offset="0%"   stopColor={GOLD_LIGHT} />
          <Stop offset="55%"  stopColor={GOLD} />
          <Stop offset="100%" stopColor={GOLD_DARK} />
        </RadialGradient>
      </Defs>
      <Ellipse cx="20" cy="26" rx="15" ry="22" fill={`url(#rb${size})`} />
      <Path
        d="M20 7 Q16 16 16 26 Q16 36 20 45"
        stroke={GOLD_DARK} strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      <Ellipse cx="14" cy="17" rx="4" ry="6" fill="rgba(255,255,255,0.2)" />
    </Svg>
  );
}

// ─── Half Bean (for split animation) ─────────────────────────────────────
function HalfBean({ side, size = 120 }) {
  const isLeft = side === 'left';
  const half = size / 2;
  return (
    <View style={{ width: half, height: size, overflow: 'hidden' }}>
      <Svg
        width={size} height={size} viewBox="0 0 120 120"
        style={{ position: 'absolute', left: isLeft ? 0 : -half }}
      >
        <Defs>
          <RadialGradient id={`hb${side}`} cx="45%" cy="38%" r="60%">
            <Stop offset="0%"   stopColor={GOLD_LIGHT} />
            <Stop offset="55%"  stopColor={GOLD} />
            <Stop offset="100%" stopColor={GOLD_DARK} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="60" cy="60" rx="44" ry="54" fill={`url(#hb${side})`} />
        <Path
          d="M60 10 Q52 28 52 60 Q52 92 60 110"
          stroke={GOLD_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
        <Ellipse cx="44" cy="36" rx="9" ry="14" fill="rgba(255,255,255,0.18)" />
      </Svg>
    </View>
  );
}

// ─── One Falling Bean ─────────────────────────────────────────────────────
function FallingBean({ config, onLanded }) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const { delay, duration, wobbleX, rotations } = config;

    Animated.timing(opacity, {
      toValue: 0.85, duration: 100, delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: height + 80, duration, delay,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => { if (finished && onLanded) onLanded(); });

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: wobbleX, duration: 700,
          easing: Easing.inOut(Easing.sine), useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -wobbleX, duration: 700,
          easing: Easing.inOut(Easing.sine), useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(rotate, {
      toValue: rotations, duration: duration * 0.8, delay,
      easing: Easing.linear, useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{
      position: 'absolute', left: config.x, top: 0,
      transform: [{ translateY }, { translateX }, { rotate: spin }],
      opacity,
    }}>
      <BeanSVG size={config.size} />
    </Animated.View>
  );
}

// ─── Bean Rain ────────────────────────────────────────────────────────────
function BeanRain({ onComplete }) {
  const beans = useMemo(() => Array.from({ length: NUM_BEANS }, (_, i) => ({
    id: i,
    x:         rand(-10, width - 30),
    delay:     rand(0, 800),
    duration:  rand(900, 1600),
    wobbleX:   rand(3, 10),
    size:      rand(16, 36),
    rotations: rand(1, 4) * (Math.random() > 0.5 ? 1 : -1),
  })), []);

  const landedCount = useRef(0);
  const done = useRef(false);

  const handleLanded = () => {
    landedCount.current += 1;
    if (!done.current && landedCount.current >= Math.floor(NUM_BEANS * 0.6)) {
      done.current = true;
      onComplete && onComplete();
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {beans.map(cfg => (
        <FallingBean key={cfg.id} config={cfg} onLanded={handleLanded} />
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MAIN SPLASH SCREEN ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'rain'

  // ── Phase 1: Intro animations ──
  // Two bean halves start together, split apart, logo appears in gap,
  // halves come back, title appears, then transitions to rain
  const leftX         = useRef(new Animated.Value(0)).current;
  const rightX        = useRef(new Animated.Value(0)).current;
  const splitOpacity  = useRef(new Animated.Value(1)).current;
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoScale     = useRef(new Animated.Value(0.5)).current;
  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const titleY        = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const introOpacity  = useRef(new Animated.Value(1)).current;

  // ── Phase 2: Rain reveal ──
  const loginRevealY  = useRef(new Animated.Value(0)).current; // curtain slides up

  useEffect(() => {
    // ═══ ANIMATION TIMELINE ═══

    // Step 1 (0–700ms): Two bean halves SPLIT APART
    Animated.parallel([
      Animated.timing(leftX, {
        toValue: -80, duration: 700,
        easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true,
      }),
      Animated.timing(rightX, {
        toValue: 80, duration: 700,
        easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true,
      }),
    ]).start(() => {

      // Step 2 (700–1300ms): Logo APPEARS in the gap between the halves
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 500,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1, damping: 14, stiffness: 100, useNativeDriver: true,
        }),
      ]).start(() => {

        // Step 3 (1300–1800ms): Halves come back and fade behind logo
        Animated.parallel([
          Animated.timing(leftX, {
            toValue: 0, duration: 500,
            easing: Easing.out(Easing.cubic), useNativeDriver: true,
          }),
          Animated.timing(rightX, {
            toValue: 0, duration: 500,
            easing: Easing.out(Easing.cubic), useNativeDriver: true,
          }),
          Animated.timing(splitOpacity, {
            toValue: 0, duration: 400, delay: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {

          // Step 4 (1800–2300ms): "SIGNATURE" + subtitle appear
          Animated.parallel([
            Animated.timing(titleOpacity, {
              toValue: 1, duration: 500,
              easing: Easing.out(Easing.cubic), useNativeDriver: true,
            }),
            Animated.timing(titleY, {
              toValue: 0, duration: 500,
              easing: Easing.out(Easing.cubic), useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.timing(subtitleOpacity, {
              toValue: 0.8, duration: 350,
              easing: Easing.out(Easing.cubic), useNativeDriver: true,
            }).start(() => {

              // Step 5 (2800ms): Hold 500ms then fade out intro → start rain
              setTimeout(() => {
                Animated.timing(introOpacity, {
                  toValue: 0, duration: 400,
                  easing: Easing.in(Easing.cubic), useNativeDriver: true,
                }).start(() => {
                  setPhase('rain');
                });
              }, 500);
            });
          });
        });
      });
    });
  }, []);

  // ── When rain finishes → reveal login seamlessly ──
  const handleRainComplete = () => {
    // Just finish — the login will appear naturally
    setTimeout(() => {
      onFinish && onFinish();
    }, 400);
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0A0800', '#000000', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      {/* ═══ PHASE 1: INTRO (Beans split → Logo → Text) ═══ */}
      {phase === 'intro' && (
        <Animated.View style={[styles.center, { opacity: introOpacity }]}>

          {/* Two bean halves that split */}
          <Animated.View style={[styles.splitRow, { opacity: splitOpacity }]}>
            <Animated.View style={{ transform: [{ translateX: leftX }] }}>
              <HalfBean side="left" size={120} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX: rightX }] }}>
              <HalfBean side="right" size={120} />
            </Animated.View>
          </Animated.View>

          {/* Logo appears in the center (between the halves) */}
          <Animated.View style={[styles.logoWrap, {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }]}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title: SIGNATURE */}
          <Animated.View style={[styles.titleWrap, {
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          }]}>
            <Text style={styles.brandName}>SIGNATURE</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View style={[styles.subtitleWrap, { opacity: subtitleOpacity }]}>
            <View style={styles.line} />
            <Text style={styles.tagline}>COFFEE & MORE</Text>
            <View style={styles.line} />
          </Animated.View>
        </Animated.View>
      )}

      {/* ═══ PHASE 2: BEAN RAIN (transition to login) ═══ */}
      {phase === 'rain' && (
        <>
          <LinearGradient
            colors={['#0A0800', '#000000', '#000000']}
            style={StyleSheet.absoluteFill}
          />
          <BeanRain onComplete={handleRainComplete} />
        </>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLACK,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  logoImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  titleWrap: {
    position: 'absolute',
    bottom: height * 0.28,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 38,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 10,
    textAlign: 'center',
  },
  subtitleWrap: {
    position: 'absolute',
    bottom: height * 0.22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '500',
    color: GOLD,
    letterSpacing: 3,
  },
  line: {
    width: 36,
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.55,
  },
});
