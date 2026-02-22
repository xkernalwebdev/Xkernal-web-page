# X-Kernel Frontend — Complete Design Specification

Extracted from source code on 2026-02-21. Ready for reuse in new pages.

---

## 1. CSS Custom Properties (Variables) — Paste into `:root`

```css
:root {
  /* ── COLORS ── */
  --color-bg-base:          #020403;   /* Page / root background */
  --color-bg-surface:       #050709;   /* Sidebar, header, cards */
  --color-bg-surface-dark:  #080c0a;   /* Terminal card, register form */
  --color-bg-input:         #020403;   /* Inputs / selects */
  --color-bg-input-alt:     #020409;   /* Login page inputs */

  /* Primary / Accent */
  --color-primary:          #05acc1;   /* Cyan — main accent, buttons, borders */
  --color-primary-dark:     #09969f;   /* Darker cyan — gradient end, blobs */
  --color-primary-light:    #6bdbd1;   /* Teal — non-technical events accent */

  /* Text */
  --color-text-base:        #f9fafb;   /* Slate-50 — body text (Tailwind) */
  --color-text-white:       #ffffff;
  --color-text-muted:       #6b7280;   /* gray-500 */
  --color-text-subtle:      #9ca3af;   /* gray-400 */
  --color-text-dim:         #d1d5db;   /* gray-300 */
  --color-text-primary:     #05acc1;   /* Cyan — labels, links, accents */

  /* Borders */
  --color-border-subtle:    rgba(255,255,255,0.05);
  --color-border-low:       rgba(255,255,255,0.10);
  --color-border-mid:       rgba(255,255,255,0.15);
  --color-border-primary:   rgba(5,172,193,0.50);
  --color-border-primary-lo:rgba(5,172,193,0.20);

  /* Status / Semantic */
  --color-success:          #05acc1;
  --color-error:            #f87171;   /* red-400 */
  --color-error-bg:         rgba(239,68,68,0.10);
  --color-error-border:     rgba(239,68,68,0.40);

  /* ── TYPOGRAPHY ── */
  --font-sans:   "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono:   ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;

  /* Font Sizes */
  --text-9px:   0.5625rem;    /* 9px  — footer, smallest labels */
  --text-10px:  0.625rem;     /* 10px — badges, meta, sub-labels */
  --text-11px:  0.6875rem;    /* 11px — card body, secondary text */
  --text-xs:    0.75rem;      /* 12px — Tailwind xs, body small */
  --text-sm:    0.875rem;     /* 14px — Tailwind sm, general body */
  --text-base:  1rem;         /* 16px — card titles */
  --text-lg:    1.125rem;     /* 18px — logo, login heading */
  --text-xl:    1.25rem;      /* 20px — page h2 */
  --text-2xl:   1.5rem;       /* 24px — dashboard h1 */
  --text-3xl:   1.875rem;     /* 30px — section headings */
  --text-4xl:   2.25rem;      /* 36px — section headings lg */
  --text-5xl:   3rem;         /* 48px — hero h1 md */
  --text-6xl:   3.75rem;      /* 60px — hero h1 lg */
  --text-7xl:   4.5rem;       /* 72px — hero h1 xl */

  /* Font Weights */
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-black:     900;   /* Hero h1, CTA buttons */

  /* Line Heights */
  --leading-none:    1;
  --leading-tight:   0.95;  /* Hero h1 */
  --leading-relaxed: 1.625; /* Body paragraphs */

  /* Letter Spacing */
  --tracking-tighter:  -0.05em;  /* Hero h1 */
  --tracking-widest:   0.2em;    /* Badges, nav mono */
  --tracking-wide:     0.15em;   /* Navbar items */
  --tracking-label:    0.14em;   /* Login labels */
  --tracking-micro:    0.18em;   /* Tags, role badges */
  --tracking-section:  0.3em;    /* Section eye-brow labels */

  /* ── SPACING ── */
  /* Sections */
  --section-py:         5rem;    /* 80px — py-20 */
  --section-py-lg:      6rem;    /* 96px — py-24 */
  --section-hero-py:    8rem;    /* 128px — py-32 */

  /* Container / Wrapper */
  --container-max:      80rem;   /* 1280px — max-w-7xl */
  --container-max-md:   72rem;   /* 1152px — max-w-6xl */
  --container-max-sm:   42rem;   /* 672px  — max-w-2xl   (forms) */
  --container-max-form: 28rem;   /* 448px  — max-w-md    (login) */
  --container-px:       1rem;    /* 16px  — px-4 */
  --container-px-lg:    1.5rem;  /* 24px  — px-6 */

  /* Cards / Panels */
  --card-p:          1.25rem;    /* 20px — p-5 */
  --card-p-lg:       1.5rem;    /* 24px — p-6 */
  --card-p-xl:       2rem;      /* 32px — p-8 */
  --card-gap:        1rem;      /* 16px — gap-4 */
  --card-gap-lg:     1.5rem;    /* 24px — gap-6 */

  /* Sidebar */
  --sidebar-width:   16rem;     /* 256px — w-64 */
  --sidebar-header-h: 4rem;    /* 64px  — h-16 */
  --nav-item-px:     1rem;
  --nav-item-py:     0.5rem;

  /* Topbar */
  --topbar-h:        4rem;      /* h-16 */

  /* ── BORDER RADIUS ── */
  --radius-sm:    0.5rem;    /* 8px  — rounded-lg */
  --radius-md:    0.75rem;   /* 12px — rounded-xl */
  --radius-lg:    1rem;      /* 16px — rounded-2xl — cards */
  --radius-xl:    1.5rem;    /* 24px — rounded-3xl — register form */
  --radius-full:  9999px;    /* rounded-full — pills */

  /* ── SHADOWS ── */
  --shadow-card:       0 18px 40px rgba(0,0,0,0.45);
  --shadow-card-lg:    0 18px 60px rgba(0,0,0,0.7);
  --shadow-topbar:     0 10px 30px rgba(0,0,0,0.7);
  --shadow-login:      0 24px 60px rgba(0,0,0,0.7);
  --shadow-glow-cyan:  0 0 20px rgba(5,172,193,0.6);
  --shadow-glow-soft:  0 0 18px rgba(5,172,193,0.5);
  --shadow-glow-xs:    0 0 12px rgba(5,172,193,0.5);
  --shadow-nav-active: 0 0 18px rgba(5,172,193,0.35);

  /* ── TRANSITIONS ── */
  --transition-fast:   150ms;
  --transition-base:   200ms;
  --transition-slow:   300ms;
  --transition-anim:   500ms;
  --transition-reveal: 1000ms;
}
```

---

## 2. JSON Format

```json
{
  "colors": {
    "background": {
      "base":        "#020403",
      "surface":     "#050709",
      "surfaceDark": "#080c0a",
      "input":       "#020403",
      "inputAlt":    "#020409"
    },
    "primary":   "#05acc1",
    "primaryDark": "#09969f",
    "secondary": "#6bdbd1",
    "text": {
      "base":    "#f9fafb",
      "white":   "#ffffff",
      "muted":   "#6b7280",
      "subtle":  "#9ca3af",
      "dim":     "#d1d5db",
      "accent":  "#05acc1"
    },
    "border": {
      "subtle":     "rgba(255,255,255,0.05)",
      "low":        "rgba(255,255,255,0.10)",
      "mid":        "rgba(255,255,255,0.15)",
      "primary":    "rgba(5,172,193,0.50)",
      "primaryLow": "rgba(5,172,193,0.20)"
    },
    "status": {
      "error":       "#f87171",
      "errorBg":     "rgba(239,68,68,0.10)",
      "errorBorder": "rgba(239,68,68,0.40)",
      "success":     "#05acc1"
    }
  },

  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
    },
    "sizes": {
      "heroH1":       { "mobile": "2.25rem", "sm": "3rem", "md": "3.75rem", "lg": "4.5rem" },
      "sectionH2":    { "base": "1.875rem",  "sm": "2.25rem", "md": "2.25rem" },
      "cardTitle":    { "base": "0.875rem",  "sm": "1rem" },
      "body":         { "base": "0.875rem",  "lg": "1.125rem" },
      "label":        "0.6875rem",
      "badge":        "0.625rem",
      "micro":        "0.5625rem",
      "navItem":      "0.6875rem",
      "sectionEyebrow": "0.75rem"
    },
    "weights": {
      "medium":   500,
      "semibold": 600,
      "bold":     700,
      "black":    900
    },
    "lineHeights": {
      "heroH1":  0.95,
      "body":    1.625,
      "normal":  1.5
    },
    "letterSpacing": {
      "tighter":  "-0.05em",
      "widest":   "0.20em",
      "wide":     "0.15em",
      "label":    "0.14em",
      "micro":    "0.18em",
      "section":  "0.30em"
    }
  },

  "spacing": {
    "sections": {
      "paddingY":     "5rem",
      "paddingYLg":   "6rem",
      "paddingYHero": "8rem"
    },
    "containers": {
      "maxWidth7xl":  "80rem",
      "maxWidth6xl":  "72rem",
      "maxWidth2xl":  "42rem",
      "maxWidthMd":   "28rem",
      "paddingX":     "1rem",
      "paddingXLg":   "1.5rem"
    },
    "components": {
      "cardPadding":   "1.25rem",
      "cardPaddingLg": "1.5rem",
      "cardPaddingXl": "2rem",
      "cardGap":       "1rem",
      "cardGapLg":     "1.5rem",
      "navItemPx":     "1rem",
      "navItemPy":     "0.5rem"
    },
    "layout": {
      "sidebarWidth":  "16rem",
      "topbarHeight":  "4rem"
    }
  },

  "components": {
    "buttons": {
      "primary": {
        "bg":           "#05acc1",
        "color":        "#020403",
        "fontWeight":   900,
        "fontSize":     "0.75rem",
        "borderRadius": "0.75rem",
        "padding":      "0.875rem 2rem",
        "tracking":     "0.2em",
        "transform":    "uppercase",
        "hover": {
          "shadow":     "0 0 20px rgba(5,172,193,0.4)",
          "scale":      "1.02",
          "overlayBg":  "rgba(255,255,255,0.20)"
        }
      },
      "secondary": {
        "bg":           "transparent",
        "color":        "#ffffff",
        "border":       "1px solid rgba(255,255,255,0.10)",
        "borderRadius": "0.75rem",
        "padding":      "0.875rem 2rem",
        "fontWeight":   700,
        "hover": {
          "borderColor": "rgba(5,172,193,0.50)",
          "bg":          "rgba(5,172,193,0.05)"
        }
      },
      "ghost": {
        "bg":           "rgba(255,255,255,0.05)",
        "color":        "#ffffff",
        "borderRadius": "0.75rem",
        "padding":      "0.5rem 1rem",
        "fontSize":     "0.625rem",
        "fontWeight":   700,
        "tracking":     "0.2em",
        "transform":    "uppercase",
        "hover":  { "bg": "rgba(255,255,255,0.10)" }
      },
      "pill": {
        "bg":           "#ffffff",
        "color":        "#020403",
        "borderRadius": "9999px",
        "padding":      "0.5rem 1.25rem",
        "fontSize":     "0.6875rem",
        "fontWeight":   700,
        "hover": {
          "bg":     "#05acc1",
          "color":  "#ffffff",
          "shadow": "0 0 20px rgba(5,172,193,0.6)"
        }
      },
      "logout": {
        "bg":           "rgba(255,255,255,0.05)",
        "color":        "#ffffff",
        "border":       "1px solid rgba(255,255,255,0.10)",
        "borderRadius": "9999px",
        "padding":      "0.375rem 0.75rem",
        "fontSize":     "0.6875rem",
        "hover":  { "bg": "rgba(255,255,255,0.10)" }
      }
    },

    "cards": {
      "base": {
        "bg":             "#050709",
        "bgOpacity":      "80%",
        "backdropBlur":   "2xl (40px)",
        "border":         "1px solid rgba(255,255,255,0.10)",
        "borderRadius":   "1rem",
        "shadow":         "0 18px 40px rgba(0,0,0,0.45)",
        "padding":        "1.25rem"
      },
      "event": {
        "bg":             "#080c0a",
        "backdropBlur":   "xl",
        "border":         "1px solid rgba(255,255,255,0.05)",
        "borderRadiusOuter": "1rem",
        "hover": {
          "border":  "1px solid rgba(5,172,193,0.60)",
          "translateY": "-0.5rem",
          "shadow":  "0 10px 40px -10px rgba(5,172,193,0.10)"
        }
      },
      "teamMember": {
        "bg":           "#050709",
        "bgOpacity":    "80%",
        "backdropBlur": "xl",
        "border":       "1px solid rgba(255,255,255,0.10)",
        "borderRadius": "1rem",
        "shadow":       "0 14px 30px rgba(0,0,0,0.50)",
        "padding":      "0.875rem"
      },
      "registerForm": {
        "bg":           "#080c0a",
        "bgOpacity":    "80%",
        "backdropBlur": "xl",
        "border":       "1px solid rgba(255,255,255,0.10)",
        "borderRadius": "1.5rem",
        "shadow":       "0 0 0 (shadow-2xl)",
        "padding":      "1.5rem 2rem"
      }
    },

    "inputs": {
      "base": {
        "bg":           "#020403",
        "border":       "1px solid rgba(255,255,255,0.10)",
        "borderRadius": "0.75rem",
        "padding":      "0.75rem",
        "fontSize":     "0.875rem",
        "color":        "#f9fafb",
        "placeholderColor": "#374151",
        "focus": {
          "border":  "1px solid #05acc1",
          "ring":    "1px solid rgba(5,172,193,0.80)",
          "outline": "none"
        }
      },
      "monospace": {
        "fontFamily":   "mono",
        "textAlign":    "center",
        "fontSize":     "1rem",
        "padding":      "0.875rem 1rem"
      }
    },

    "badges": {
      "technical": {
        "bg":       "rgba(5,172,193,0.15)",
        "color":    "#05acc1",
        "radius":   "9999px",
        "px":       "0.5rem",
        "py":       "0.25rem",
        "fontSize": "0.625rem",
        "fontWeight": 600,
        "tracking": "0.16em",
        "uppercase": true
      },
      "nonTechnical": {
        "bg":       "rgba(107,219,209,0.15)",
        "color":    "#6bdbd1",
        "radius":   "9999px",
        "px":       "0.5rem",
        "py":       "0.25rem",
        "fontSize": "0.625rem",
        "fontWeight": 600
      },
      "online": {
        "bg":       "rgba(5,5,9,1)",
        "color":    "#9ca3af",
        "border":   "1px solid rgba(255,255,255,0.10)",
        "radius":   "9999px",
        "padding":  "0.25rem 0.75rem",
        "fontSize": "0.625rem",
        "tracking": "0.18em"
      }
    },

    "sidebar": {
      "width":        "16rem",
      "bg":           "#050709",
      "bgOpacity":    "80%",
      "backdropBlur": "2xl",
      "borderRight":  "1px solid rgba(255,255,255,0.10)",
      "shadow":       "0 18px 60px rgba(0,0,0,0.7)",
      "navItem": {
        "px":          "1rem",
        "py":          "0.5rem",
        "borderRadius": "0.75rem",
        "gap":         "0.75rem",
        "fontSize":    "0.875rem",
        "fontWeight":  500,
        "inactive": {
          "color":     "#d1d5db",
          "hover":     { "color": "#ffffff", "bg": "rgba(255,255,255,0.05)" }
        },
        "active": {
          "bg":    "rgba(5,172,193,0.15)",
          "color": "#05acc1",
          "shadow":"0 0 18px rgba(5,172,193,0.35)"
        }
      }
    },

    "navbar": {
      "height":       "3.5rem",
      "bg":           "rgba(2,4,3,0.70)",
      "backdropBlur": "md",
      "borderBottom": "1px solid rgba(255,255,255,0.05)",
      "zIndex":       50,
      "navLinkColor": "#9ca3af",
      "navLinkHoverColor": "#ffffff",
      "navLinkActiveLine": "2px solid #05acc1"
    },

    "logo": {
      "size":         "2.25rem",
      "borderRadius": "0.75rem",
      "gradient":     "linear-gradient(135deg, #05acc1, #09969f)",
      "innerBg":      "#020403",
      "textColor":    "#05acc1",
      "fontWeight":   900
    }
  },

  "layout": {
    "breakpoints": {
      "sm":  "640px",
      "md":  "768px",
      "lg":  "1024px",
      "xl":  "1280px",
      "2xl": "1536px"
    },
    "grid": {
      "aboutCards":       { "default": 1, "md": 3 },
      "eventCards":       { "default": 1, "sm": 2, "lg": 4 },
      "teamMembers":      { "default": 2, "sm": 3, "md": 4, "lg": 5 },
      "teamMemberCards":  { "default": 1, "sm": 2, "lg": 3 },
      "statsCards":       { "default": 1, "sm": 3 },
      "heroSection":      { "default": 1, "lg": 2 }
    },
    "gaps": {
      "sectionGap":  "1.25rem",
      "cardGap":     "1.5rem",
      "heroGap":     "2.5rem"
    }
  },

  "animations": {
    "blob": {
      "keyframes": "0% translate(0,0) scale(1) → 33% translate(30px,-50px) scale(1.1) → 66% translate(-20px,20px) scale(0.9)",
      "duration":  "7s",
      "timing":    "infinite"
    },
    "textShimmer": {
      "keyframes": "background-position: 0% 50% → 100% 50%",
      "duration":  "3s",
      "timing":    "linear infinite",
      "bgSize":    "200% auto"
    },
    "tilt3d": {
      "type":      "perspective(1000px) rotateX / rotateY",
      "intensity": "15deg default, 5deg cards",
      "easing":    "ease-out 200ms"
    },
    "sectionReveal": {
      "keyframes": "opacity-0 translateY(10px) → opacity-100 translateY(0)",
      "duration":  "1000ms",
      "trigger":   "IntersectionObserver threshold 0.15"
    },
    "pingDot": {
      "type":     "animate-ping",
      "color":    "#05acc1",
      "opacity":  0.75
    },
    "stars": {
      "layer1": "90s linear infinite",
      "layer2": "60s linear infinite reverse",
      "layer3": "40s linear infinite",
      "direction": "translate3d(-400px, -400px, 0)"
    }
  },

  "effects": {
    "glassmorphism": {
      "bg":           "rgba(5,7,9,0.80)",
      "backdropBlur": "2xl (40px)",
      "border":       "1px solid rgba(255,255,255,0.10)"
    },
    "noiseSvg":     "https://grainy-gradients.vercel.app/noise.svg",
    "noiseOpacity": 0.20,
    "blobBlur":     "120–130px",
    "blobOpacity":  "0.10–0.20",
    "blobColors":   ["#05acc1", "#6bdbd1", "#09969f"],
    "blobBlend":    "mix-blend-mode: screen"
  }
}
```

---

## 3. Quick-Reference Cheat Sheet

| Token              | Value                  | Usage                                 |
|--------------------|------------------------|---------------------------------------|
| `--color-bg-base`  | `#020403`              | Page background                       |
| `--color-bg-surface` | `#050709`            | Sidebar, cards, top-bar               |
| `--color-primary`  | `#05acc1`              | Primary brand cyan: buttons, borders  |
| `--color-primary-dark` | `#09969f`          | Gradient end, blobs                   |
| `--color-secondary`| `#6bdbd1`              | Non-technical events, alt accents     |
| `--font-sans`      | Inter                  | All non-code text                     |
| `--font-mono`      | system monospace       | Code blocks, badges, terminal UI      |
| `--radius-lg`      | `1rem (16px)`          | Default card radius                   |
| `--radius-md`      | `0.75rem (12px)`       | Inputs, nav items, small cards        |
| `--radius-full`    | `9999px`               | Pills, avatars, online badges         |
| Section `py`       | `80px / 96px`          | Vertical section rhythm               |
| Max container      | `1280px` (7xl)         | Public pages                          |

---

## 4. Key Patterns to Replicate

### Glassmorphism Card
```css
background: rgba(5,7,9,0.80);
backdrop-filter: blur(40px);
border: 1px solid rgba(255,255,255,0.10);
border-radius: 1rem;
box-shadow: 0 18px 40px rgba(0,0,0,0.45);
```

### Primary CTA Button
```css
background: #05acc1;
color: #020403;
font-weight: 900;
font-size: 0.75rem;
letter-spacing: 0.2em;
text-transform: uppercase;
border-radius: 0.75rem;
padding: 0.875rem 2rem;
transition: all 200ms;
/* Hover */
box-shadow: 0 0 20px rgba(5,172,193,0.4);
transform: scale(1.02);
/* White overlay sweep effect on hover */
::after { background: rgba(255,255,255,0.20); translate: 0 100% → 0 0; }
```

### Animated Background (3 blobs + noise)
```css
/* Blob */
.blob { width: 40vw; height: 40vw; background: #05acc1;
  border-radius: 50%; mix-blend-mode: screen; blur: 120px;
  opacity: 0.10; animation: blob 7s infinite; }
/* Noise overlay */
.noise { background-image: url(noise.svg); opacity: 0.20; }
```

### Section Eye-brow Label
```css
color: #05acc1; font-size: 0.75rem; font-weight: 700;
letter-spacing: 0.3em; text-transform: uppercase;
```

### Ping Dot (online indicator)
```jsx
<span class="relative flex h-1.5 w-1.5">
  <span class="animate-ping absolute h-full w-full rounded-full bg-[#05acc1] opacity-75" />
  <span class="relative h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
</span>
```
