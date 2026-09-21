// components/ui/offer-carousel.tsx
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, Clock, ArrowRight, Info, ShieldCheck, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../../context/ThemeContext";

export interface Offer {
  id: string | number;
  title: string;
  category?: string;
  tag?: string;
  discount?: string;
  expiresIn?: string;
  description?: string;
  imageUrl?: string;
  imageSrc?: string;
  imageAlt?: string;
  brandName: string;
  brandLogoSrc: string;
  href?: string;
  onClick?: () => void;
  dealCode?: string;
  promoCode?: string;
  specifications?: Record<string, string | number>;
  perks?: string[];
}

interface OfferCardProps {
  offer: Offer;
  twoPerScreen?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, twoPerScreen = true }) => {
  const { isLight } = useTheme();

  const heroImage = offer.imageUrl || offer.imageSrc || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80';
  const displayCategory = offer.category || offer.tag || 'Special Offer';
  const displayDiscount = offer.discount || (offer.promoCode ? `Use ${offer.promoCode}` : 'Special Offer');
  const displayExpires = offer.expiresIn || 'Limited Time';

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 select-none cursor-pointer",
        twoPerScreen
          ? "w-[calc(50%-8px)] sm:w-[calc(50%-10px)]"
          : "w-60 sm:w-64"
      )}
      onClick={offer.onClick}
    >
      <div
        className={cn(
          "flex flex-col h-full overflow-hidden rounded-2xl border shadow-xs transition duration-300 hover:shadow-lg",
          isLight
            ? "bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40"
            : "bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40"
        )}
      >
        {/* Banner Media & Badges */}
        <div
          className={cn(
            "relative h-44 sm:h-48 overflow-hidden flex items-center justify-center p-3",
            isLight ? "bg-slate-100" : "bg-[#131518]"
          )}
        >
          <img
            src={heroImage}
            alt={offer.imageAlt || offer.title}
            className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Discount Pill */}
          <div className="absolute left-3 top-3 rounded-full bg-[#E5B65F] px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{displayDiscount}</span>
          </div>
        </div>

        {/* Content Details */}
        <div
          className={cn(
            "flex flex-col justify-between flex-grow space-y-3 p-4",
            isLight ? "bg-white" : "bg-[#181A1F]"
          )}
        >
          <div className="space-y-1.5">
            <div
              className={cn(
                "flex items-center justify-between text-[11px] font-semibold",
                isLight ? "text-slate-500" : "text-gray-400"
              )}
            >
              <span className="uppercase tracking-wider text-[10px] font-bold text-[#B88728] dark:text-[#E5B65F]">
                {displayCategory}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{displayExpires}</span>
              </div>
            </div>

            <h3
              className={cn(
                "h-10 text-sm sm:text-base font-bold line-clamp-2 leading-snug transition-colors",
                isLight
                  ? "text-slate-900 group-hover:text-[#B88728]"
                  : "text-white group-hover:text-[#E5B65F]"
              )}
            >
              {offer.title}
            </h3>

            {offer.description && (
              <p
                className={cn(
                  "text-xs line-clamp-2",
                  isLight ? "text-slate-500" : "text-gray-400"
                )}
              >
                {offer.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-between pt-3 border-t",
              isLight ? "border-slate-100" : "border-white/10"
            )}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <img
                src={offer.brandLogoSrc}
                alt={`${offer.brandName} logo`}
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border flex-shrink-0",
                  isLight ? "border-slate-200 bg-slate-100" : "border-white/10 bg-[#131518]"
                )}
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <p
                  className={cn(
                    "text-xs font-bold truncate",
                    isLight ? "text-slate-900" : "text-white"
                  )}
                >
                  {offer.brandName}
                </p>
                <p
                  className={cn(
                    "text-[10px] font-semibold truncate",
                    isLight ? "text-slate-500" : "text-gray-400"
                  )}
                >
                  {displayCategory}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase text-[#B88728] dark:text-[#E5B65F] group-hover:underline">
                View Offer
              </span>
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transform transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-[#B88728] group-hover:text-white flex-shrink-0",
                  isLight ? "bg-slate-100 text-slate-800" : "bg-white/10 text-white"
                )}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface OfferCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  offers: Offer[];
  title?: string;
  subtitle?: string;
  autoScrollInterval?: number;
  twoPerScreen?: boolean;
}

export const OfferCarousel = React.forwardRef<HTMLDivElement, OfferCarouselProps>(
  (
    {
      offers,
      title,
      subtitle,
      className,
      autoScrollInterval = 3400,
      twoPerScreen = true,
      ...props
    },
    ref
  ) => {
    const { isLight } = useTheme();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Group offers into slides
    const slides = React.useMemo(() => {
      if (!twoPerScreen) return offers.map((o) => [o]);
      const res: Offer[][] = [];
      for (let i = 0; i < offers.length; i += 2) {
        res.push(offers.slice(i, i + 2));
      }
      return res;
    }, [offers, twoPerScreen]);

    const numSlides = slides.length;

    // Smooth forward auto-play
    React.useEffect(() => {
      if (isHovered || numSlides <= 1) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % numSlides);
      }, autoScrollInterval);

      return () => clearInterval(timer);
    }, [isHovered, numSlides, autoScrollInterval]);

    const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + numSlides) % numSlides);
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % numSlides);
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h2
                  className={cn(
                    "text-xl sm:text-2xl font-black tracking-tight",
                    isLight ? "text-slate-900" : "text-white"
                  )}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-widest mt-0.5",
                    isLight ? "text-slate-500" : "text-gray-400"
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Left Scroll Button */}
          {numSlides > 1 && (
            <button
              onClick={handlePrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 cursor-pointer shadow-md backdrop-blur-md border",
                isLight
                  ? "bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-[#B88728]"
                  : "bg-black/75 text-white border-white/20 hover:bg-black hover:border-[#E5B65F]"
              )}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Smooth Motion Slide Track */}
          <motion.div
            className="flex w-full cursor-grab active:cursor-grabbing"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
          >
            {slides.map((slidePair, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full flex-shrink-0 flex items-stretch gap-3 sm:gap-4 px-1"
              >
                {slidePair.map((offer) => (
                  <OfferCard
                    key={`${slideIdx}-${offer.id}`}
                    offer={offer}
                    twoPerScreen={twoPerScreen}
                  />
                ))}
              </div>
            ))}
          </motion.div>

          {/* Right Scroll Button */}
          {numSlides > 1 && (
            <button
              onClick={handleNext}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 cursor-pointer shadow-md backdrop-blur-md border",
                isLight
                  ? "bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-[#B88728]"
                  : "bg-black/75 text-white border-white/20 hover:bg-black hover:border-[#E5B65F]"
              )}
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Pagination Dots at Bottom */}
        {numSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: numSlides }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-colors duration-300 cursor-pointer",
                    isActive
                      ? "w-6 bg-[#B88728] dark:bg-[#E5B65F]"
                      : isLight
                        ? "w-2 bg-slate-300 hover:bg-slate-400"
                        : "w-2 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

OfferCarousel.displayName = "OfferCarousel";
