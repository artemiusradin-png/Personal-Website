"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

export default function Home() {
  const basePath = process.env.NODE_ENV === "production" ? "/Personal-Website" : "";
  const landingBackgroundUrl = `${basePath}/landing-bg.jpg`;
  const [activeStageId, setActiveStageId] = useState(stages[0].id);
  const [pageFlow, setPageFlow] = useState<PageFlow>("landing");
  const [isLeavingLanding, setIsLeavingLanding] = useState(false);
  const [isLeavingAbout, setIsLeavingAbout] = useState(false);
  const [isLandingReady, setIsLandingReady] = useState(false);
  const [isAboutReady, setIsAboutReady] = useState(false);
  const [isEntryLockActive, setIsEntryLockActive] = useState(false);
  const journeyStartRef = useRef<HTMLDivElement | null>(null);
  const jumpLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const hasEnteredJourney = pageFlow === "journey";

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setIsLandingReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (pageFlow !== "about") return;
    const id = window.requestAnimationFrame(() => setIsAboutReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [pageFlow]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (pageFlow !== "journey" || isEntryLockActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [pageFlow, isEntryLockActive]);

  useEffect(() => {
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
  }, [hasEnteredJourney]);

  useEffect(() => {
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
  }, [activeStageId, hasEnteredJourney]);

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? stages[0],
    [activeStageId],
  );

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
          <div className="about-menu-layout">
            <p className="about-menu-heading">
              ABOUT ME <span />
            </p>
            <p className="about-topic-item">GLOBAL FINANCE &amp; POLICY</p>
            <p className="about-intro">
              I am a finance student at UBC Sauder building at the intersection of
              corporate finance, public policy, and international markets. My path
              has taken me from Kyiv to Germany, Canada, Poland, and Hong Kong,
              where I have combined academic rigor with hands-on experience in
              banking, government, and research. I am especially interested in how
              capital markets, institutions, and regulation shape long-term
              economic growth. Through internships, competitions, and research, I
              focus on building practical analytical skills while developing a
              global perspective on finance and policy.
            </p>
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
            <section className="final-landing-page" aria-label="Connect and credentials">
              <p className="final-page-kicker">CONNECT</p>
              <h2>Credentials</h2>
              <p className="final-page-copy">
                UBC Sauder School of Business. Finance and economics track. Research on redistribution and growth.
              </p>
              <div className="final-page-divider" aria-hidden="true" />
              <p className="final-page-contact">artemius.radin@gmail.com</p>
              <p className="final-page-contact">linkedin.com/in/artemisradin</p>
            </section>
          </main>
        </div>
      </div>
      <section
        className={`credentials-screen mobile-credentials-screen ${
          pageFlow === "journey" && activeStage.id === "whats-next" ? "visible" : ""
        }`}
        aria-label="Connect and credentials"
      >
        <p className="credentials-kicker">CONNECT</p>
        <h2>Credentials</h2>
        <p className="credentials-copy">
          UBC Sauder School of Business. Finance and economics track. Research on redistribution and growth.
        </p>
        <div className="credentials-divider" aria-hidden="true" />
        <p className="credentials-contact">artemius.radin@gmail.com</p>
        <p className="credentials-contact">linkedin.com/in/artemisradin</p>
      </section>
    </div>
  );
}
