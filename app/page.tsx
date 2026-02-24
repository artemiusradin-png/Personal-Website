"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";

type JourneyStage = {
  id: string;
  navLabel: string;
  year: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  title: string;
  summary: string;
  highlights: string[];
};

const JourneyVisual = dynamic(() => import("@/components/JourneyVisual"), {
  ssr: false,
});

const stages: JourneyStage[] = [
  {
    id: "2016-kyiv",
    navLabel: "2016",
    year: "2016",
    city: "Kyiv",
    country: "Ukraine",
    lat: 50.4501,
    lng: 30.5234,
    zoom: 6,
    title: "Academic foundation in Kyiv",
    summary:
      "Enrolled at Lyzeum Naukova Zmina, a specialized school with a focus on natural sciences and economics. Built a strong quantitative foundation in mathematics and developed early fluency in English and German, setting the stage for an international academic path.",
    highlights: [
      "Core curriculum in mathematics, physics, and economics",
      "Early interest in international finance and capital markets",
      "Competitive entrance to specialized lyceum program",
      "Multilingual development (Ukrainian, English, German)",
    ],
  },
  {
    id: "2022-kyiv-war",
    navLabel: "2022 • Ukraine",
    year: "2022",
    city: "Kyiv",
    country: "Ukraine",
    lat: 50.4501,
    lng: 30.5234,
    zoom: 6,
    title: "War in Ukraine and relocation",
    summary:
      "Russia's full-scale invasion in February 2022 reshaped daily life in Kyiv. Despite the disruption, I maintained focus on long-term goals and made the difficult decision to relocate to Germany to continue my education safely while preserving my path toward international finance and policy.",
    highlights: [
      "Adapted to wartime conditions while completing school requirements",
      "Evaluated options for continuing education abroad",
      "Relocated to Germany to continue studies and long-term goals",
      "Maintained connection to Ukrainian academic and professional networks",
    ],
  },
  {
    id: "2022-ettlingen",
    navLabel: "2022 • Germany",
    year: "2022",
    city: "Ettlingen",
    country: "Germany",
    lat: 48.9408,
    lng: 8.4072,
    zoom: 7,
    title: "Move to Germany",
    summary:
      "Settled in Ettlingen, Baden-Württemberg, and completed secondary education at Heisenberg-Gymnasium. Joined Wolter GmbH as an intern, gaining first-hand experience in financial planning and business modeling in a real corporate environment.",
    highlights: [
      "Abitur preparation at Heisenberg-Gymnasium",
      "Financial planning and analysis support at Wolter GmbH",
      "Built Excel models for budgeting and forecasting",
      "Exposure to German business culture and corporate finance",
    ],
  },
  {
    id: "2023-vancouver",
    navLabel: "2023",
    year: "2023",
    city: "Vancouver",
    country: "Canada",
    lat: 49.2827,
    lng: -123.1207,
    zoom: 7,
    title: "UBC and global expansion",
    summary:
      "Started the Bachelor of Commerce (Finance) program at UBC Sauder School of Business with an Economics minor. Took on leadership roles in the UBC Entrepreneurship Club and began building a global finance profile through coursework, case competitions, and networking.",
    highlights: [
      "UBC BCom, Finance concentration + Economics minor",
      "Leadership role in UBC Entrepreneurship Club",
      "Core courses in corporate finance, investments, and financial modeling",
      "Participation in case competitions and industry events",
    ],
  },
  {
    id: "2024-berlin",
    navLabel: "2024",
    year: "2024",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lng: 13.405,
    zoom: 7,
    title: "Government policy exposure",
    summary:
      "Interned in the Deutscher Bundestag in the office of Nicolas Zippelius, MdB. Supported policy analysis and briefing preparation for economic and financial committee discussions, gaining insight into how legislation and regulation shape the financial sector.",
    highlights: [
      "Analyst Intern in Office of Nicolas Zippelius, MdB",
      "Committee-level strategic briefing and research support",
      "Policy analysis on economic and financial topics",
      "Exposure to legislative process and regulatory frameworks",
    ],
  },
  {
    id: "2025-warsaw",
    navLabel: "2025",
    year: "2025",
    city: "Warsaw",
    country: "Poland",
    lat: 52.2297,
    lng: 21.0122,
    zoom: 7,
    title: "Corporate banking execution",
    summary:
      "Joined BNP Paribas in Warsaw as a Financial Analyst Intern in the Corporate Client Group. Supported cross-border financing and M&A processes, built valuation models (DCF, LBO, comparables), and developed automated checks for deal due diligence.",
    highlights: [
      "Financial Analyst Intern, Corporate Client Group",
      "Built DCF, LBO, and comparables valuation models",
      "Supported cross-border financing and deal execution",
      "Automated data checks and due diligence processes",
    ],
  },
  {
    id: "2026-toronto",
    navLabel: "2026 • Toronto",
    year: "2026",
    city: "Toronto",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    zoom: 7,
    title: "National finance competition performance",
    summary:
      "Led a team of 4 to 2nd place at the Battle on Bay Finance Competition in Toronto. Served as valuation analyst, applying DCF, LBO, comparables, VaR, and sensitivity analysis across multiple case studies under time pressure.",
    highlights: [
      "2nd Place, Battle on Bay Finance Competition",
      "Led team of 4 across multiple case studies",
      "Applied DCF, LBO, comparables, VaR, and sensitivity methods",
      "Competed against top Canadian finance programs",
    ],
  },
  {
    id: "2026-hong-kong",
    navLabel: "2026 • Hong Kong",
    year: "2026",
    city: "Hong Kong",
    country: "Hong Kong SAR",
    lat: 22.3193,
    lng: 114.1694,
    zoom: 8,
    title: "Asia exposure and policy engagement",
    summary:
      "Exchange semester at CUHK Business School (Finance track) in Hong Kong. In parallel, joined the Institute of Legislative Ideas and the Institute of Economic Strategy in Ukraine, contributing to policy and economic research while building Asia-Pacific exposure.",
    highlights: [
      "CUHK exchange semester (Finance track)",
      "Joined Institute of Legislative Ideas (Ukraine)",
      "Joined Institute of Economic Strategy (Ukraine)",
      "Asia-Pacific finance and markets exposure",
    ],
  },
  {
    id: "2026-2027-research",
    navLabel: "2026 • Research",
    year: "2026",
    city: "Hong Kong",
    country: "Hong Kong SAR",
    lat: 22.3193,
    lng: 114.1694,
    zoom: 8,
    title: "First research: redistribution and economic growth",
    summary:
      "Conducting first academic research on the correlation and association between redistribution and economic growth in Canada and China. Building a scientific paper that compares policy approaches and outcomes across both economies.",
    highlights: [
      "Research on redistribution and economic growth",
      "Comparative analysis: Canada and China",
      "Correlation and association methodology",
      "Scientific paper in progress",
    ],
  },
  {
    id: "whats-next",
    navLabel: "What's next?",
    year: "What's next?",
    city: "Global",
    country: "World",
    lat: 15,
    lng: 0,
    zoom: 4,
    title: "What's next?",
    summary:
      "The next chapter is open: continuing to build at the intersection of finance, policy, and global markets.",
    highlights: [
      "Open to high-impact roles across global finance",
      "Continue research and applied analytics",
      "Build long-term cross-border leadership",
    ],
  },
];

type PageFlow = "landing" | "about" | "journey";
type MobileStory = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
};

const mobileTopics = [
  "ALL",
  "ANIMALS",
  "ENVIRONMENT",
  "HISTORY & CULTURE",
  "SCIENCE",
  "TRAVEL",
] as const;

export default function Home() {
  const basePath = process.env.NODE_ENV === "production" ? "/Personal-Website" : "";
  const landingBackgroundUrl = `${basePath}/landing-bg.jpg`;
  const aboutDesktopImageUrl = `${basePath}/about-desktop.jpg`;
  const aboutMobileImageUrl = `${basePath}/about-mobile.jpg`;
  const aboutHeroStyle = useMemo(
    () =>
      ({
        ["--about-bg-desktop" as string]: `url("${aboutDesktopImageUrl}")`,
        ["--about-bg-mobile" as string]: `url("${aboutMobileImageUrl}")`,
      }) as CSSProperties,
    [aboutDesktopImageUrl, aboutMobileImageUrl],
  );
  const [activeStageId, setActiveStageId] = useState(stages[0].id);
  const [pageFlow, setPageFlow] = useState<PageFlow>("landing");
  const [isLeavingLanding, setIsLeavingLanding] = useState(false);
  const [isLeavingAbout, setIsLeavingAbout] = useState(false);
  const [isLandingReady, setIsLandingReady] = useState(false);
  const [isAboutReady, setIsAboutReady] = useState(false);
  const [isEntryLockActive, setIsEntryLockActive] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileActiveTopic, setMobileActiveTopic] =
    useState<(typeof mobileTopics)[number]>("ALL");
  const journeyStartRef = useRef<HTMLDivElement | null>(null);
  const jumpLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const hasEnteredJourney = pageFlow === "journey";

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1099px)");
    const update = () => setIsMobileViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setIsLandingReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const desktopImage = new Image();
    desktopImage.src = aboutDesktopImageUrl;

    const mobileImage = new Image();
    mobileImage.src = aboutMobileImageUrl;
  }, [aboutDesktopImageUrl, aboutMobileImageUrl]);

  useEffect(() => {
    if (pageFlow !== "about") return;
    const id = window.requestAnimationFrame(() => setIsAboutReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [pageFlow]);

  useEffect(() => {
    if (isMobileViewport) return;
    const previousOverflow = document.body.style.overflow;
    if (pageFlow !== "journey" || isEntryLockActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileViewport, pageFlow, isEntryLockActive]);

  useEffect(() => {
    if (!isMobileViewport) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileViewport, mobileMenuOpen]);

  useEffect(() => {
    if (isMobileViewport) return;
    if (!hasEnteredJourney) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>(".stage-card"));
    if (!cards.length) return;
    const scrollContainer = document.querySelector<HTMLElement>(".timeline-panel");

    let rafId = 0;

    const updateActiveFromScroll = () => {
      rafId = 0;
      const useContainerScroll =
        !!scrollContainer &&
        scrollContainer.scrollHeight > scrollContainer.clientHeight + 4;
      const containerRect = scrollContainer?.getBoundingClientRect();
      const focalY = useContainerScroll && containerRect
        ? containerRect.top + containerRect.height * 0.5
        : window.innerHeight * 0.42;

      let bestCard: HTMLElement | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenterY - focalY);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestCard = card;
        }
      }

      const stageId = bestCard?.getAttribute("data-stage-id");
      if (!stageId) return;

      setActiveStageId((current) => (current === stageId ? current : stageId));
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveFromScroll);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    scrollContainer?.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      scrollContainer?.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [hasEnteredJourney, isMobileViewport]);

  useEffect(() => {
    if (isMobileViewport) return;
    if (!hasEnteredJourney) return;
    if (!window.matchMedia("(max-width: 1099px)").matches) return;

    const id = window.requestAnimationFrame(() => {
      const activeLink = document.querySelector<HTMLElement>(".year-nav .year-link.active");
      if (!activeLink) return;

      activeLink.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });

    return () => window.cancelAnimationFrame(id);
  }, [activeStageId, hasEnteredJourney, isMobileViewport]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? stages[0],
    [activeStageId],
  );
  const mobileStories = useMemo<MobileStory[]>(() => {
    const categories = mobileTopics.slice(1);
    const images = [landingBackgroundUrl, aboutDesktopImageUrl, aboutMobileImageUrl];
    return stages
      .filter((stage) => stage.id !== "whats-next")
      .map((stage, index) => ({
        id: stage.id,
        category: categories[index % categories.length],
        title: `${stage.year}: ${stage.title}`,
        excerpt: `${stage.city}, ${stage.country}. ${stage.summary}`,
        imageUrl: images[index % images.length],
      }));
  }, [aboutDesktopImageUrl, aboutMobileImageUrl, landingBackgroundUrl]);
  const filteredStories = useMemo(() => {
    const loweredSearch = mobileSearchQuery.trim().toLowerCase();
    return mobileStories.filter((story) => {
      const topicMatch =
        mobileActiveTopic === "ALL" || story.category === mobileActiveTopic;
      const searchMatch =
        !loweredSearch ||
        story.title.toLowerCase().includes(loweredSearch) ||
        story.excerpt.toLowerCase().includes(loweredSearch) ||
        story.category.toLowerCase().includes(loweredSearch);
      return topicMatch && searchMatch;
    });
  }, [mobileActiveTopic, mobileSearchQuery, mobileStories]);
  const featuredStory = filteredStories[0] ?? mobileStories[0];
  const regularStories = filteredStories.slice(1);

  const jumpToAbout = () => {
    if (jumpLockRef.current || pageFlow !== "landing" || isLeavingLanding) return;
    jumpLockRef.current = true;
    setIsEntryLockActive(true);
    setIsLeavingLanding(true);
    window.setTimeout(() => {
      setPageFlow("about");
      setIsLeavingLanding(false);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 420);
    window.setTimeout(() => {
      jumpLockRef.current = false;
      setIsEntryLockActive(false);
    }, 900);
  };

  const jumpToJourney = () => {
    if (jumpLockRef.current || pageFlow === "journey" || isLeavingAbout) return;
    if (pageFlow === "landing") {
      jumpToAbout();
      return;
    }
    jumpLockRef.current = true;
    setIsEntryLockActive(true);
    setIsLeavingAbout(true);
    window.setTimeout(() => {
      setPageFlow("journey");
      setIsLeavingAbout(false);
      setActiveStageId(stages[0].id);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 420);
    window.setTimeout(() => {
      jumpLockRef.current = false;
      setIsEntryLockActive(false);
    }, 900);
  };

  if (isMobileViewport === null) {
    return <div className="mobile-boot" />;
  }

  if (isMobileViewport) {
    return (
      <div className="mobile-news-app">
        <header className="mobile-news-header">
          <div className="mobile-brand-mark" aria-label="Brand">
            AR
          </div>
          <div className="mobile-header-actions">
            <button type="button" className="mobile-login-btn">
              LOGIN
            </button>
            <button type="button" className="mobile-subscribe-btn">
              SUBSCRIBE
            </button>
          </div>
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <section className="mobile-hero-block">
          <h1>
            <span>LATEST</span>
            <span>STORIES</span>
          </h1>
          <p>Subscribe to unlock premium coverage, analysis, and global updates.</p>
          <div className="mobile-hero-accent" aria-hidden="true" />
        </section>

        <main className="mobile-feed">
          {featuredStory && (
            <article className="mobile-featured-card" role="button" tabIndex={0}>
              <img src={featuredStory.imageUrl} alt={featuredStory.title} loading="eager" />
              <div className="mobile-featured-overlay">
                <p>{featuredStory.category}</p>
                <h2>{featuredStory.title}</h2>
                <span>▸ READ</span>
              </div>
            </article>
          )}

          {regularStories.map((story) => (
            <article key={story.id} className="mobile-story-card">
              <img src={story.imageUrl} alt={story.title} loading="lazy" />
              <div className="mobile-story-copy">
                <span className="mobile-story-tag">{story.category}</span>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
              </div>
            </article>
          ))}
        </main>

        {mobileMenuOpen && (
          <aside className="mobile-menu-overlay" role="dialog" aria-modal="true">
            <div className="mobile-menu-top">
              <p>Subscribe</p>
              <div className="mobile-menu-icons">
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setMobileSearchOpen((current) => !current)}
                >
                  ⌕
                </button>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileSearchOpen(false);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {mobileSearchOpen && (
              <div className="mobile-search-wrap">
                <input
                  type="search"
                  placeholder="Search stories..."
                  value={mobileSearchQuery}
                  onChange={(event) => setMobileSearchQuery(event.target.value)}
                />
              </div>
            )}

            <div className="mobile-menu-content">
              <button
                type="button"
                className="mobile-menu-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Newsletters
              </button>

              <div className="mobile-menu-section">
                <p className="mobile-menu-label">
                  TOPICS <span />
                </p>
                {mobileTopics
                  .filter((topic) => topic !== "ALL")
                  .map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      className={`mobile-topic-link ${mobileActiveTopic === topic ? "active" : ""}`}
                      onClick={() => {
                        setMobileActiveTopic(topic);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {topic}
                    </button>
                  ))}
              </div>

              <div className="mobile-menu-section">
                <p className="mobile-menu-label">
                  SITES <span />
                </p>
                <button type="button" className="mobile-site-link">WATCH TV!</button>
                <button type="button" className="mobile-site-link">READ THE MAGAZINE</button>
                <button type="button" className="mobile-site-link">VISIT NAT GEO FAMILY</button>
                <button type="button" className="mobile-site-link">BOOK A TRIP</button>
                <button type="button" className="mobile-site-link">INSPIRE YOUR KIDS</button>
                <button type="button" className="mobile-site-link">LISTEN TO PODCASTS</button>
              </div>
            </div>
          </aside>
        )}
      </div>
    );
  }

  return (
    <div>
      {pageFlow === "landing" && (
        <section
          className={`landing-hero ${isLandingReady ? "ready" : ""} ${isLeavingLanding ? "leaving" : ""}`}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(10, 20, 30, 0.55) 0%, rgba(10, 20, 30, 0.4) 100%), url("${landingBackgroundUrl}")`,
          }}
          onWheel={(event) => {
            if (event.deltaY > 8) {
              event.preventDefault();
              jumpToAbout();
            }
          }}
          onTouchStart={(event) => {
            touchStartYRef.current = event.touches[0]?.clientY ?? null;
          }}
          onTouchMove={(event) => {
            const startY = touchStartYRef.current;
            const currentY = event.touches[0]?.clientY;
            if (startY == null || currentY == null) return;
            if (startY - currentY > 18) {
              event.preventDefault();
              jumpToAbout();
            }
          }}
        >
          <p className="landing-kicker">Artemis Radin</p>
          <h1>Professional Journey</h1>
          <p>
            Scroll down to explore who I am and my interactive career timeline.
          </p>
          <div className="landing-swipe-hint" aria-hidden="true">
            <span>Scroll Down</span>
            <div className="swipe-chevrons">
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>
      )}

      {pageFlow === "about" && (
        <section
          className={`about-hero ${isAboutReady ? "ready" : ""} ${isLeavingAbout ? "leaving" : ""}`}
          style={aboutHeroStyle}
          onWheel={(event) => {
            if (event.deltaY > 8) {
              event.preventDefault();
              jumpToJourney();
            }
          }}
          onTouchStart={(event) => {
            touchStartYRef.current = event.touches[0]?.clientY ?? null;
          }}
          onTouchMove={(event) => {
            const startY = touchStartYRef.current;
            const currentY = event.touches[0]?.clientY;
            if (startY == null || currentY == null) return;
            if (startY - currentY > 18) {
              event.preventDefault();
              jumpToJourney();
            }
          }}
        >
          <div className="about-shell">
            <div className="about-panel">
              <p className="landing-kicker about-kicker">Who I Am</p>
              <h1>Artemis Radin</h1>
              <p className="about-intro">
                Finance and economics student at UBC Sauder, currently on exchange at CUHK in Hong Kong.
              </p>
              <p className="about-detail">
                Born in Kyiv and relocated to Germany during the war, I built a path across corporate banking, policy, and research.
              </p>
            </div>
            <aside className="about-rail" aria-label="Profile highlights">
              <p>
                Focus: finance, policy, and global markets with hands-on experience at BNP Paribas, the German Bundestag, and Ukrainian think tanks.
              </p>
              <div className="about-tags" aria-label="Focus areas">
                <span>Finance</span>
                <span>Policy</span>
                <span>Research</span>
                <span>Global Markets</span>
              </div>
              <p className="about-languages">Ukrainian • English • German</p>
            </aside>
          </div>
          <div className="landing-swipe-hint about-swipe-hint" aria-hidden="true">
            <span>Scroll Down</span>
            <div className="swipe-chevrons">
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>
      )}

      <div
        ref={journeyStartRef}
        className={`journey-page ${pageFlow === "journey" ? "entered-from-landing" : "is-hidden-before-entry"}`}
      >
        <div className="map-background" aria-hidden="true">
          <JourneyVisual stage={activeStage} allStages={stages} />
        </div>
        <div className="map-background-overlay" aria-hidden="true" />
        <div className="journey-shell">
          <p className="corner-name">Artemis Radin</p>
          <div className="mobile-stage-status" aria-live="polite">
            <p className="label">Active Stage</p>
            <h2>
              {activeStage.year}: {activeStage.city}, {activeStage.country}
            </h2>
            <p>{activeStage.title}</p>
          </div>
          <aside className="year-nav">
            <p className="label">Artemis Radin</p>
            <h1>Professional Journey</h1>
            <p className="subtext">Year-by-year path across countries, finance, and policy.</p>
            <nav>
              {stages.map((stage) => (
                <a
                  key={stage.id}
                  href={`#stage-${stage.id}`}
                  className={`year-link ${activeStageId === stage.id ? "active" : ""} ${
                    activeStageId === stage.id &&
                    stage.city !== "Kyiv" &&
                    stage.country !== "Canada"
                      ? "active-shift-left"
                      : ""
                  }`}
                >
                  {stage.navLabel}
                </a>
              ))}
            </nav>
          </aside>

          <section className="map-panel">
            <div className="map-caption">
              <p className="label">Active Stage</p>
              <h2>
                {activeStage.year}: {activeStage.city}, {activeStage.country}
              </h2>
              <p>{activeStage.title}</p>
            </div>
          </section>

          <main className="timeline-panel">
            {stages.map((stage) => (
              <article
                key={stage.id}
                id={`stage-${stage.id}`}
                data-stage-id={stage.id}
                className="stage-card"
              >
                <p className="label">{stage.year}</p>
                <h3>{stage.title}</h3>
                <p className="location">
                  {stage.city}, {stage.country}
                </p>
                <p>{stage.summary}</p>
                <ul>
                  {stage.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
