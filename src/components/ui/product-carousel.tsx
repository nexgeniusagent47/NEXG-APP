// components/ui/product-carousel.tsx
import * as React from "react";
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Clock, Info, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../../context/ThemeContext";

// --- TYPE DEFINITIONS ---
export interface Product {
  id: string | number;
  name: string;
  quantity: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  deliveryTime: string;
  imageUrl: string;
  onAdd?: () => void;
  specifications?: Record<string, string | number>;
  perks?: string[];
}

interface ProductCardProps {
  product: Product;
  twoPerScreen?: boolean;
}

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  className?: string;
  autoScrollInterval?: number;
  twoPerScreen?: boolean;
}

// Reusable Product Card Component with theme consistency
const ProductCard: React.FC<ProductCardProps> = ({ product, twoPerScreen = true }) => {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.onAdd) {
      product.onAdd();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 select-none",
        twoPerScreen
          ? "w-[calc(50%-8px)] sm:w-[calc(50%-10px)]"
          : "w-60 sm:w-64"
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full overflow-hidden rounded-2xl border shadow-xs transition duration-300 hover:shadow-lg",
          isLight
            ? "bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40"
            : "bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40"
        )}
      >
        {/* Image and Badges */}
        <div
          className={cn(
            "relative h-44 sm:h-48 overflow-hidden flex items-center justify-center p-3",
            isLight ? "bg-slate-100" : "bg-[#131518]"
          )}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Discount Pill */}
          {product.discount && (
            <div className="absolute left-3 top-3 rounded-full bg-[#E5B65F] px-2.5 py-0.5 text-[10px] font-bold text-slate-950 shadow-xs">
              {product.discount}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div
          className={cn(
            "flex flex-col justify-between flex-grow space-y-3 p-4",
            isLight ? "bg-white" : "bg-[#181A1F]"
          )}
        >
          <div className="space-y-1.5">
            <div
              className={cn(
                "flex items-center space-x-1.5 text-[11px] font-semibold",
                isLight ? "text-slate-600" : "text-gray-400"
              )}
            >
              <Clock className="h-3.5 w-3.5 text-[#7d5a11] dark:text-[#E5B65F]" />
              <span>{product.deliveryTime}</span>
            </div>
            
            <h3
              className={cn(
                // No fixed height. `h-10` pinned this box to 40px while a long title
                // needed 77px at 360px wide, so two thirds of the name was cut off
                // mid-word on every phone — the same defect already fixed in
                // `offer-carousel.tsx`, which never got carried across to this file.
                //
                // `line-clamp-2` is the only height mechanism here on purpose: a clamp
                // and a fixed height are two mechanisms fighting over one box, and the
                // fixed height always wins the part that matters.
                "text-sm sm:text-base font-bold line-clamp-2 leading-snug transition-colors",
                isLight
                  ? "text-slate-900 group-hover:text-[#B88728]"
                  : "text-white group-hover:text-[#E5B65F]"
              )}
            >
              {product.name}
            </h3>
            
            <p
              className={cn(
                "text-xs font-medium truncate",
                isLight ? "text-slate-600" : "text-gray-400"
              )}
            >
              {product.quantity}
            </p>
          </div>

          {/* Pricing & Add Action */}
          <div
            className={cn(
              "flex items-center justify-between pt-3 border-t",
              isLight ? "border-slate-100" : "border-white/10"
            )}
          >
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-base sm:text-lg font-bold tracking-tight",
                  isLight ? "text-slate-900" : "text-white"
                )}
              >
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                /* Theme-aware, unlike this line until now. The card branches on `isLight`
                   everywhere else and this one did not, so it rendered #475569 - a dark slate -
                   on the dark card at 2.3:1 while the actual price beside it was correctly white.
                   It is the "was" figure: secondary, but still a price, and 2.3:1 is not legible.
                   slate-400 is the dark-mode floor DESIGN.md documents at 6.86:1 on the card;
                   slate-600 is 7.58:1 on white. */
                <span className={cn('text-xs line-through', isLight ? 'text-slate-600' : 'text-slate-400')}>
                  KSh {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleAdd}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs",
                isAdded
                  ? "bg-emerald-600 text-white border border-emerald-600"
                  : isLight
                    ? // #7d5a11, not #B88728: the fill gold is 3.21:1 as text on white and
                      // DESIGN.md records #7d5a11 as the 5.37:1 alternative for exactly this.
                      // The hover fill is #B88728, where white text is 3.21:1; slate-950 on the
                      // same fill is 5.55:1 and is DESIGN.md's documented inverse on accent.
                      "border border-slate-200 bg-[#B88728]/10 text-[#7d5a11] hover:bg-[#B88728] hover:text-slate-950"
                    : "border border-white/15 bg-[#E5B65F]/15 text-[#E5B65F] hover:bg-[#E5B65F] hover:text-black"
              )}
            >
              {isAdded ? (
                <>
                  <Check size={13} className="stroke-[3]" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <Plus size={13} className="stroke-[2.5]" />
                  <span>ADD</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN CAROUSEL COMPONENT WITH FOREVER SMOOTH CONVEYOR FLOW ---
export const ProductCarousel = React.forwardRef<HTMLDivElement, ProductCarouselProps>(
  (
    {
      title,
      subtitle,
      products,
      viewAllHref = "#",
      className,
      autoScrollInterval = 3200,
      twoPerScreen = true,
    },
    ref
  ) => {
    const { isLight } = useTheme();
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Group products into slides (pairs of 2 if twoPerScreen)
    const slides = React.useMemo(() => {
      if (!twoPerScreen) return products.map((p) => [p]);
      const res: Product[][] = [];
      for (let i = 0; i < products.length; i += 2) {
        res.push(products.slice(i, i + 2));
      }
      return res;
    }, [products, twoPerScreen]);

    const numSlides = slides.length;

    // Auto-advance slide smoothly forward in a seamless loop
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
      const { t } = useLanguage();
      setCurrentIndex((prev) => (prev + 1) % numSlides);
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className={cn(
                "text-xl sm:text-2xl font-bold tracking-tight",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest mt-0.5",
                  isLight ? "text-slate-600" : "text-gray-400"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-xs font-bold text-[#7d5a11] dark:text-[#E5B65F] hover:underline"
            >
              View All &rarr;
            </a>
          )}
        </div>

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Left Chevron */}
          {numSlides > 1 && (
            <button
              onClick={handlePrev}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 cursor-pointer shadow-md backdrop-blur-md border",
                isLight
                  ? "bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-[#B88728]"
                  : "bg-black/75 text-white border-white/20 hover:bg-black hover:border-[#E5B65F]"
              )}
              aria-label={t.ui.productcarousel.s_10bb09}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Smooth Motion Slide Track with drag/swipe support */}
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
                {slidePair.map((product) => (
                  <ProductCard
                    key={`${slideIdx}-${product.id}`}
                    product={product}
                    twoPerScreen={twoPerScreen}
                  />
                ))}
              </div>
            ))}
          </motion.div>

          {/* Right Chevron */}
          {numSlides > 1 && (
            <button
              onClick={handleNext}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 right-2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition duration-300 cursor-pointer shadow-md backdrop-blur-md border",
                isLight
                  ? "bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-[#B88728]"
                  : "bg-black/75 text-white border-white/20 hover:bg-black hover:border-[#E5B65F]"
              )}
              aria-label={t.ui.productcarousel.s_7141bc}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Pagination Dots at Bottom: Clean continuous indicator */}
        {numSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: numSlides }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    // The measured target was 8x8, which is not tappable on a phone.
                    // `min-h-6 min-w-6` makes it 24x24 (the WCAG 2.2 2.5.8 minimum)
                    // while the painted pill stays exactly its old size: size classes
                    // set the content box, `p-2` surrounds it with transparent padding,
                    // and `bg-clip-content` keeps the background out of that padding.
                    // `min-h`, not `h` — a fixed height would win over the padding and
                    // leave the target 16px tall, which is how the first attempt failed.
                    "h-2 min-h-6 p-2 bg-clip-content rounded-full transition-colors duration-300 cursor-pointer",
                    isActive
                      ? "w-6 min-w-6 bg-[#B88728] dark:bg-[#E5B65F]"
                      : isLight
                        ? "w-2 min-w-6 bg-slate-300 hover:bg-slate-400"
                        : "w-2 min-w-6 bg-white/20 hover:bg-white/40"
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

ProductCarousel.displayName = "ProductCarousel";
