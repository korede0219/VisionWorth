import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Trash2,
  Bookmark,
  Share2
} from "lucide-react";
import { PRODUCTS, MATERIALS, TESTIMONIALS, EDITORIAL_IMAGES } from "./data";
import { Inquiry, WishlistItem, Product } from "./types";

export default function App() {
  // Preloader State
  const [showPreloader, setShowPreloader] = useState(true);

  // Scroll States
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  // Menu and Drawer States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Product Showcase States (The Architect Chair)
  const [activeSigIdx, setActiveSigIdx] = useState(0);
  const [isSigHovered, setIsSigHovered] = useState(false);

  // Materials Horizontal Scroll Progress
  const materialsRef = useRef<HTMLDivElement>(null);
  const [materialsProgress, setMaterialsProgress] = useState(0);

  // Testimonial State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Wishlist and Inquiry States
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);

  // Catalog category filter state
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentView, setCurrentView] = useState<"home" | "catalog">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);

  // Form input states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formInterest, setFormInterest] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formTitle, setFormTitle] = useState("Place An Order");

  // Custom Cursor state (Only active on desktop screen sizes)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCursorHovered, setIsCursorHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Signature piece images setup — same luxury accent chair, 3 angles
  const signatureImages = [
    { 
      front: "/Wooden_lounge_chair_studio_202607131956.jpeg", 
      back: "/Wooden_lounge_chair_studio_202607131956_2.jpeg", 
      label: "01 / 03" 
    },
    { 
      front: "/Wooden_lounge_chair_studio_202607131956_2.jpeg", 
      back: "/Wooden_lounge_chair_studio_202607131956_3.jpeg", 
      label: "02 / 03" 
    },
    { 
      front: "/Wooden_lounge_chair_studio_202607131956_3.jpeg", 
      back: "/Wooden_lounge_chair_studio_202607131956.jpeg", 
      label: "03 / 03" 
    }
  ];

  // Initialize and load persistent local storage states
  useEffect(() => {
    // Check if desktop screen size
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);

    // Disable preloader after 2 seconds
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);

    // Load wishlist
    const localWishlist = localStorage.getItem("visionworth_wishlist");
    if (localWishlist) {
      try {
        setWishlist(JSON.parse(localWishlist));
      } catch (err) {
        console.error("Failed to parse local wishlist", err);
      }
    }

    // Load inquiries logs
    const localInquiries = localStorage.getItem("visionworth_inquiries");
    if (localInquiries) {
      try {
        setInquiries(JSON.parse(localInquiries));
      } catch (err) {
        console.error("Failed to parse local inquiries", err);
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // Track mouse position on desktop
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktop]);

  // Scroll trigger monitoring for header navigation & progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(percentage);

      if (scrollTop > window.innerHeight - 80) {
        setIsNavScrolled(true);
      } else {
        setIsNavScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance testimonials slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Materials horizontally scroll tracking
  const handleMaterialsScroll = () => {
    if (materialsRef.current) {
      const element = materialsRef.current;
      const maxScroll = element.scrollWidth - element.clientWidth;
      const ratio = maxScroll > 0 ? (element.scrollLeft / maxScroll) * 100 : 0;
      setMaterialsProgress(ratio);
    }
  };

  // Safe Wishlist state helpers
  const saveWishlist = (list: WishlistItem[]) => {
    setWishlist(list);
    localStorage.setItem("visionworth_wishlist", JSON.stringify(list));
  };

  const handleAddToWishlist = (product: string, price: string, image: string) => {
    const alreadyExists = wishlist.some((item) => item.product === product);
    if (alreadyExists) {
      setIsWishlistOpen(true);
      return;
    }
    const newList = [...wishlist, { product, price, image }];
    saveWishlist(newList);
    setIsWishlistOpen(true);
  };

  const handleRemoveFromWishlist = (idx: number) => {
    const newList = [...wishlist];
    newList.splice(idx, 1);
    saveWishlist(newList);
  };

  const handleClearWishlist = () => {
    saveWishlist([]);
  };

  // Safe inquiries helpers
  const saveInquiries = (list: Inquiry[]) => {
    setInquiries(list);
    localStorage.setItem("visionworth_inquiries", JSON.stringify(list));
  };

  const handleDeleteInquiry = (idx: number) => {
    const newList = [...inquiries];
    newList.splice(idx, 1);
    saveInquiries(newList);
  };

  const handleClearInquiries = () => {
    if (window.confirm("Are you sure you want to clear all inquiries logs?")) {
      saveInquiries([]);
    }
  };

  // Form submission handling
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone || !formInterest) return;

    // Generate random Reference Code
    const randCode = `VW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: Inquiry = {
      refCode: randCode,
      name: formName,
      email: formEmail,
      phone: formPhone,
      interest: formInterest,
      message: formMessage,
      date: new Date().toISOString()
    };

    const newInquiriesList = [...inquiries, newInquiry];
    saveInquiries(newInquiriesList);

    // Open receipt confirmation
    setActiveInquiry(newInquiry);
    setIsReceiptOpen(true);

    // Reset Form Input fields
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormInterest("");
    setFormMessage("");
    setFormTitle("Place An Order");
  };

  // Pre-fill form from catalog request quote action
  const handleRequestQuote = (product: string, price: string, category: string) => {
    setFormInterest(category);
    setFormMessage(`I would like to place an order inquiry for ${product} (${price}). Let's align on lead times, delivery details, and wood finishes.`);
    setFormTitle(`Order: ${product}`);

    // Smooth scroll to form section
    const formSection = document.getElementById("newsletter");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Wishlist bulk inquiry action
  const handleWishlistBulkInquiry = () => {
    if (wishlist.length === 0) return;
    const itemsText = wishlist.map((item) => `${item.product} (${item.price})`).join(", ");
    setFormInterest("custom");
    setFormMessage(`I am interested in commissioning a custom order for: ${itemsText}. Please coordinate details, wood choice samples, and delivery timelines to Lagos.`);
    setFormTitle("Custom Bulk Commission");
    setIsWishlistOpen(false);

    // Smooth scroll to form section
    const formSection = document.getElementById("newsletter");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Share to WhatsApp redirection
  const handleWhatsAppRedirect = () => {
    if (!activeInquiry) return;

    const interestLabels: Record<string, string> = {
      seating: "Seating",
      tables: "Tables & Dining",
      bedroom: "Bedroom Suite",
      office: "Workspace & Office",
      custom: "Fully Custom / Bespoke",
      consultation: "General Consultation"
    };

    const text = `*Vision Worth - Order Commission Inquiry*\n\n` +
                 `*Ref:* ${activeInquiry.refCode}\n` +
                 `*Name:* ${activeInquiry.name}\n` +
                 `*Phone:* ${activeInquiry.phone}\n` +
                 `*Email:* ${activeInquiry.email}\n` +
                 `*Interest:* ${interestLabels[activeInquiry.interest] || "Bespoke"}\n` +
                 `*Message:* ${activeInquiry.message || "N/A"}`;

    const url = `https://api.whatsapp.com/send?phone=2348054622076&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setIsReceiptOpen(false);
  };

  const renderCatalogView = () => {
    const filteredProducts = PRODUCTS.filter((prod) => {
      const matchesCategory = activeCategory === "all" || prod.category === activeCategory;
      const matchesSearch = 
        prod.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    return (
      <div className="w-full bg-cream min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col relative z-20">
        {/* Header Title Section */}
        <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button
              onClick={() => {
                setCurrentView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              {...hoverProps}
              className="group flex items-center space-x-2 text-[9px] tracking-widest uppercase text-txt-muted hover:text-gold transition-colors duration-300 mb-6 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Return to Main Showroom</span>
            </button>
            <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block font-semibold">
              The Digital Showroom
            </span>
            <h1 className="font-display font-light text-4xl md:text-6xl text-dark tracking-tight mb-4 uppercase">
              Bespoke Portfolio
            </h1>
            <p className="font-body text-xs md:text-sm text-txt-muted max-w-xl leading-relaxed">
              Explore our comprehensive catalog of {PRODUCTS.length} handcrafted furniture designs. Filter by category, search specific materials or models, and request tailored quotes.
            </p>
          </div>
          
          <div className="font-mono text-[9px] text-txt-muted uppercase tracking-widest bg-dark/5 px-4 py-2.5 border border-dark/5">
            Database Sync: <span className="text-gold font-bold">{filteredProducts.length} Items Found</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-7xl mx-auto w-full mb-12 bg-cream border border-dark/15 p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6 shadow-sm">
          {/* Search bar */}
          <div className="w-full lg:w-1/3 relative">
            <input
              type="text"
              placeholder="Search by model, finish, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(16);
              }}
              className="w-full bg-cream-dark/30 text-dark border-b border-dark/20 focus:border-gold focus:outline-none py-3 px-4 text-xs tracking-wider placeholder-neutral-500 transition-colors duration-300 font-body"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted hover:text-dark text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="w-full lg:w-2/3 flex flex-wrap gap-2 lg:justify-end">
            {["all", "seating", "tables", "bedroom", "office", "custom"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(16);
                }}
                {...hoverProps}
                className={`font-body text-[9px] tracking-widest uppercase px-4 py-2.5 border transition-all duration-300 cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-dark text-cream border-dark font-medium" 
                    : "bg-transparent text-txt-muted hover:text-dark border-dark/10 hover:border-dark/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div className="max-w-7xl mx-auto w-full flex-grow">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedProducts.map((prod) => (
                <div key={prod.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                    <img 
                      src={prod.image} 
                      alt={prod.product} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-105 origin-center" 
                    />
                    
                    {/* Overlay action drawer on hover */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
                      <button 
                        onClick={() => handleRequestQuote(prod.product, prod.price, prod.category)}
                        {...hoverProps}
                        className="bg-gold text-black font-body text-[9px] tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors duration-300 w-44 text-center font-medium cursor-pointer"
                      >
                        Request Quote
                      </button>
                      <button 
                        onClick={() => handleAddToWishlist(prod.product, prod.price, prod.image)}
                        {...hoverProps}
                        className="border border-white/20 hover:border-gold hover:text-gold text-cream font-body text-[9px] tracking-widest uppercase px-6 py-2.5 transition-colors duration-300 w-44 text-center font-medium cursor-pointer"
                      >
                        Save to Wishlist
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="mt-4 flex flex-col space-y-1">
                    <span className="font-body text-[8px] tracking-widest text-gold uppercase font-semibold">
                      {prod.category}
                    </span>
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-display text-base text-dark group-hover:text-gold transition-colors duration-300 font-light truncate">
                        {prod.product}
                      </h4>
                      <span className="font-display text-gold text-xs font-light shrink-0">
                        {prod.price}
                      </span>
                    </div>
                    <span className="font-body text-[9px] text-txt-muted">
                      {prod.spec}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-dark/10 p-8 max-w-lg mx-auto shadow-sm">
              <p className="font-display text-lg text-dark mb-2 font-light">No matching pieces found</p>
              <p className="font-body text-xs text-txt-muted mb-6">Try selecting another category or refining your search term.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="bg-dark text-cream px-6 py-3 font-body text-[9px] uppercase tracking-widest hover:bg-gold hover:text-dark transition-colors duration-300 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More Pagination */}
        {filteredProducts.length > displayedProducts.length && (
          <div className="max-w-7xl mx-auto w-full text-center mt-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + 16)}
              {...hoverProps}
              className="inline-block border border-dark px-10 py-4 font-body text-[10px] tracking-widest uppercase hover:bg-dark hover:text-cream transition-all duration-300 cursor-pointer"
            >
              Load More Masterpieces
            </button>
            <p className="font-mono text-[9px] text-txt-muted mt-3 uppercase tracking-wider">
              Showing {displayedProducts.length} of {filteredProducts.length} items
            </p>
          </div>
        )}

        {/* Mini footer of the catalog */}
        <div className="max-w-7xl mx-auto w-full mt-32 pt-12 border-t border-dark/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-widest text-txt-muted uppercase">
          <div>
            &copy; 2026 Vision Worth • Lagos, Nigeria
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-gold transition-colors duration-300 cursor-pointer"
          >
            Back To Top
          </button>
        </div>
      </div>
    );
  };

  // Cursor hover listeners helper
  const hoverProps = {
    onMouseEnter: () => setIsCursorHovered(true),
    onMouseLeave: () => setIsCursorHovered(false),
  };

  return (
    <div className="bg-cream text-dark min-h-screen relative font-body selection:bg-gold selection:text-black">
      
      {/* 1. Custom Smooth Follower Cursor (Desktop Only) */}
      {isDesktop && (
        <motion.div
          className={`fixed pointer-events-none z-[9999] rounded-full translate-x-[-50%] translate-y-[-50%] ${
            isCursorHovered ? "w-7 h-7 bg-transparent border border-gold" : "w-2 h-2 bg-gold"
          }`}
          animate={{
            x: mousePos.x,
            y: mousePos.y,
          }}
          transition={{
            type: "spring",
            stiffness: 800,
            damping: 35,
            mass: 0.1
          }}
        />
      )}

      {/* 2. Page preloader screen */}
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            id="preloader"
            className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center pointer-events-auto grain-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Decorative corner accents */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/20" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/20" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/20" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/20" />

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center select-none relative z-10"
            >
              <h1 className="font-display font-light text-3xl md:text-5xl text-cream tracking-[0.2em] uppercase leading-none">
                <em className="text-gold not-italic font-display italic tracking-[0.15em]">A1</em>{" "}
                Vision Worth
              </h1>
              {/* Animated gold shimmer line */}
              <motion.div 
                className="h-[1px] gold-shimmer-line mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
              <p className="font-display italic text-[10px] text-gold/70 tracking-[0.3em] mt-4">
                "Building Vision with A1 Excellence"
              </p>
              <p className="font-body text-[8px] text-neutral-500 tracking-[0.35em] uppercase mt-3">
                Lagos • Bespoke Furniture
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Sticky top scroll progress rule */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[999] pointer-events-none bg-transparent">
        <div 
          className="h-full bg-gold transition-all duration-100 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 4. Navigation Header */}
      <header 
        id="main-nav" 
        className={`fixed top-0 left-0 w-full z-[900] flex justify-between items-center py-5 px-6 md:px-12 border-b border-transparent transition-all duration-500 ${
          isNavScrolled 
            ? "bg-cream/90 backdrop-blur-md border-gold/20 py-4 shadow-sm" 
            : "bg-transparent py-5"
        }`}
      >
        {/* Hamburger open button */}
        <button 
          id="open-menu-btn" 
          onClick={() => setIsMenuOpen(true)}
          {...hoverProps}
          className="flex items-center space-x-3 group focus:outline-none py-2 px-1"
        >
          <div className="flex flex-col space-y-1.5 w-6">
            <span className="w-full h-[1px] bg-dark group-hover:bg-gold transition-colors duration-300" />
            <span className="w-2/3 h-[1px] bg-dark group-hover:bg-gold transition-colors duration-300" />
          </div>
          <span className="hidden md:inline font-body text-[9px] tracking-widest text-dark uppercase group-hover:text-gold transition-colors duration-300">
            Menu
          </span>
        </button>

        {/* Brand Logo centered */}
        <a 
          href="#hero" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          {...hoverProps}
          className="font-display font-light text-lg md:text-2xl text-dark tracking-[0.2em] uppercase select-none hover:opacity-85 transition-opacity duration-300"
        >
          <em className="text-gold not-italic font-display italic">A1</em>{" "}
          Vision Worth
        </a>

        {/* Actions panel right */}
        <div className="flex items-center space-x-4">
          <button 
            id="open-wishlist-btn" 
            onClick={() => setIsWishlistOpen(true)}
            {...hoverProps}
            className="font-body text-[9px] tracking-widest uppercase text-dark hover:text-gold transition-colors duration-300 py-2 px-1 relative"
          >
            Wishlist ({wishlist.length})
          </button>
          
          <a 
            href="#newsletter" 
            {...hoverProps}
            className="relative overflow-hidden inline-block border border-dark px-4 md:px-6 py-2.5 text-[9px] tracking-widest uppercase text-dark font-body group transition-colors duration-500"
          >
            <span className="absolute inset-0 bg-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom" />
            <span className="relative z-10 group-hover:text-cream transition-colors duration-500">
              Book Consultation
            </span>
          </a>
        </div>
      </header>

      {/* 5. Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="nav-drawer"
            className="fixed inset-0 bg-black/95 z-[990] flex flex-col justify-between p-8 md:p-20 text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Header row */}
            <div className="flex justify-between items-center w-full">
              <span className="font-body text-[9px] tracking-widest text-gold uppercase">Brand Index</span>
              
              <button 
                id="close-menu-btn" 
                onClick={() => setIsMenuOpen(false)}
                {...hoverProps}
                className="p-2 group focus:outline-none flex items-center space-x-2"
              >
                <span className="text-[9px] tracking-widest text-neutral-400 group-hover:text-gold transition-colors duration-300 uppercase">
                  Close
                </span>
                <X className="w-5 h-5 text-cream group-hover:text-gold transition-colors duration-300 stroke-[1.2]" />
              </button>
            </div>

            {/* Middle Nav Links */}
            <nav className="flex flex-col items-center text-center space-y-4 md:space-y-6 my-auto">
              {[
                { label: "Home", href: "#hero", view: "home" as const },
                { label: "Bespoke Catalog", href: "#shop", view: "catalog" as const },
                { label: "Our Collections", href: "#collections", view: "home" as const },
                { label: "Signature Chair", href: "#signature", view: "home" as const },
                { label: "Brand Philosophy", href: "#philosophy", view: "home" as const },
                { label: "Materials", href: "#materials", view: "home" as const },
                { label: "Our Process", href: "#process", view: "home" as const },
              ].map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setCurrentView(link.view);
                    if (link.view === "catalog") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      setTimeout(() => {
                        const target = document.querySelector(link.href);
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 200);
                    }
                  }}
                  {...hoverProps}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  className="font-display text-3xl md:text-5xl font-light hover:text-gold transition-colors duration-500 tracking-wider"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Footer row */}
            <div className="w-full">
              <div className="h-[1px] bg-white/10 w-full my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] tracking-widest text-neutral-400 uppercase font-body">
                <div>
                  <p className="text-gold mb-1 font-semibold">Showroom Address</p>
                  <p className="not-italic text-neutral-400 normal-case">
                    A1 Visionworth Classic Nigeria Ltd.<br />
                    57, Iwaya Road, Yaba, Lagos<br />
                    <span className="text-neutral-500 text-[9px]">RC: 1299138</span>
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-gold mb-1 font-semibold">Inquiries</p>
                  <a href="tel:+2348054622076" {...hoverProps} className="hover:text-gold text-neutral-400 block transition-colors duration-300">
                    +234 805 462 2076
                  </a>
                  <a href="tel:+2348026572272" {...hoverProps} className="hover:text-gold text-neutral-400 block transition-colors duration-300">
                    +234 802 657 2272
                  </a>
                  <a href="mailto:slvisionwcinfo@gmail.com" {...hoverProps} className="hover:text-gold text-neutral-400 block transition-colors duration-300 normal-case mt-1">
                    slvisionwcinfo@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === "home" ? (
        <>
          {/* 6. SECTION 01 — HERO */}
      <section id="hero" className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-cream pt-20">
        {/* Top 65% bleed container */}
        <div className="relative w-full h-[60%] md:h-[65%] overflow-hidden grain-overlay">
          {/* Animated scale loop on image */}
          <motion.img 
            id="hero-image" 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920" 
            alt="Luxury Architectural Interior" 
            className="w-full h-full object-cover origin-center"
            animate={{ scale: [1.07, 1.0, 1.07] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Bottom fade shadow overlay */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cream via-cream/60 to-transparent pointer-events-none z-[2]" />
          
          {/* Decorative diagonal accent line */}
          <motion.div 
            className="absolute bottom-16 right-8 md:right-16 w-[1px] h-0 bg-gold/40 origin-top z-[3]"
            style={{ transform: "rotate(-15deg)" }}
            animate={{ height: [0, 120] }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-14 md:right-24 w-[1px] h-0 bg-gold/20 origin-top z-[3]"
            style={{ transform: "rotate(-15deg)" }}
            animate={{ height: [0, 80] }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          />
        </div>
  {'Calacatta'}
        {/* Bottom details block */}
        <div className="w-full h-[40%] md:h-[35%] flex items-center bg-cream px-6 md:px-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-center">
            {/* Left specifications banner */}
            <div className="md:col-span-8 flex flex-col justify-center">
              {/* Gold line expander */}
              <motion.div 
                id="hero-gold-line" 
                className="h-[1px] bg-gold mb-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
                New Collection — 2026
              </span>
              <h2 className="font-display font-light text-3xl md:text-5xl lg:text-6xl text-dark leading-[0.95] mb-4">
                Crafted For Those<br />Who Demand More
              </h2>
              <p className="font-body text-xs md:text-sm text-txt-muted max-w-xl mb-6">
                A study in perfect geometry, lineage, and the silent weight of raw African hardwoods.
              </p>
            </div>

            {/* Right quote container */}
            <div className="hidden md:flex md:col-span-4 pl-8 border-l border-gold/25 flex-col justify-center">
              <p className="font-display italic text-lg text-txt-muted leading-relaxed">
                &ldquo;True luxury is the preservation of silence in space.&rdquo;
              </p>
              <span className="font-body text-[8px] tracking-widest text-gold uppercase mt-3">
                Vision Worth
              </span>
            </div>
          </div>
        </div>

        {/* Discover scroll icon details */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10">
          <div className="w-[1px] h-12 bg-gold/30 relative overflow-hidden mb-2">
            <motion.span 
              className="absolute top-0 left-0 w-full h-3 bg-gold"
              animate={{ y: [0, 28, 28, 0], opacity: [0, 1, 0, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="font-body text-[8px] tracking-[0.25em] text-gold uppercase">
            Scroll to Discover
          </span>
        </div>
      </section>

      {/* 7. SECTION 02 — DOUBLE MARQUEE RUNNERS */}
      <section className="w-full bg-dark overflow-hidden py-8 select-none relative z-20">
        {/* Subtle top/bottom gold border lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="flex flex-col space-y-5">
          
          {/* Row 1: Left runner marquee */}
          <div className="flex overflow-hidden w-full">
            <motion.div 
              className="flex whitespace-nowrap font-display text-gold-light italic text-sm md:text-base tracking-widest uppercase marquee-glow"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 32
              }}
            >
              <span>Handcrafted &bull; Luxury Living &bull; Timeless Design &bull; Made To Order &bull;&nbsp;</span>
              <span>Handcrafted &bull; Luxury Living &bull; Timeless Design &bull; Made To Order &bull;&nbsp;</span>
            </motion.div>
          </div>

          {/* Row 2: Right runner marquee */}
          <div className="flex overflow-hidden w-full">
            <motion.div 
              className="flex whitespace-nowrap font-display text-gold-light italic text-sm md:text-base tracking-widest uppercase marquee-glow"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 42
              }}
            >
              <span>Bespoke Furniture &bull; Lagos Origin &bull; White Glove Delivery &bull; Since 2010 &bull;&nbsp;</span>
              <span>Bespoke Furniture &bull; Lagos Origin &bull; White Glove Delivery &bull; Since 2010 &bull;&nbsp;</span>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 8. SECTION 03 — EDITORIAL SPACES / FEATURED COLLECTIONS */}
      <section id="collections" className="w-full bg-cream py-20 md:py-32 px-6 md:px-12">
        {/* Header blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-end">
          <div>
            <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
              Our Collections
            </span>
            <h2 className="font-display font-light text-4xl md:text-6xl text-dark leading-none">
              Spaces That Tell<br />Your Story
            </h2>
          </div>
          <div className="md:text-right max-w-md md:justify-self-end">
            <p className="font-body text-xs md:text-sm text-txt-muted leading-relaxed">
              We curate spaces with a profound sense of permanence. Each suite is conceived as an architectural dialogue between timber, light, and the human form.
            </p>
          </div>
        </div>

        {/* Showcase Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "The Serenity Suite",
              desc: "Bedroom Collection • 12 Pieces",
              img: "/Wooden_king-size_bed_frame_202607131957.jpeg",
              category: "bedroom"
            },
            {
              title: "The Grand Feast",
              desc: "Dining Collection • 8 Pieces",
              img: "/Oval_wooden_dining_table_studio_202607131956.jpeg",
              category: "tables"
            },
            {
              title: "The Executive Study",
              desc: "Office Collection • 6 Pieces",
              img: "/Oak_executive_desk_studio_202607131957.jpeg",
              category: "office"
            },
          ].map((item) => (
            <div key={item.title} className="group flex flex-col">
              {/* Image with slide up overlay on group hover */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-105 origin-center" 
                />
                
                {/* Overlay layer */}
                <div className="absolute inset-0 bg-black/75 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-end p-8">
                  <span className="font-display text-gold text-2xl mb-1">{item.title}</span>
                  <span className="font-body text-[8px] tracking-widest text-neutral-400 uppercase mb-6">
                    {item.desc}
                  </span>
                  <button 
                    onClick={() => handleRequestQuote(item.title, "Full suite commission", item.category)}
                    {...hoverProps}
                    className="font-body text-[9px] tracking-widest text-cream uppercase hover:text-gold transition-colors duration-300 text-left"
                  >
                    Explore Suite &rarr;
                  </button>
                </div>
              </div>

              {/* Text row details */}
              <div className="mt-4 flex justify-between items-baseline">
                <h3 className="font-display text-lg text-dark group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <span className="font-body text-[9px] tracking-widest text-txt-muted uppercase">
                  {item.desc.split("•")[1]?.trim() || "Bespoke"}
                </span>
              </div>
              
              {/* Thin gold rule line widening */}
              <div className="h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-500 mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* 9. SECTION 04 — BRAND PHILOSOPHY */}
      <section id="philosophy" className="w-full bg-dark text-cream grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left bleed side */}
        <div className="relative h-72 md:h-auto min-h-[400px] overflow-hidden">
          <img 
            src="/Handcrafted_wooden_screen_studio_202607131957.jpeg" 
            alt="High-End Design Space" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Right Details Panel side */}
        <div className="bg-cream-dark text-dark px-8 py-16 md:p-24 flex flex-col justify-center">
          <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-3 block">
            Philosophical Lineage
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-dark leading-[0.95] mb-8">
            Design Is Not<br />What It Looks Like.<br />It Is How It Lives.
          </h2>
          
          <div className="space-y-6 text-xs md:text-sm text-txt-muted font-body leading-relaxed max-w-lg mb-8">
            <p>
              Founded in Lagos, Vision Worth is a tactile expression of contemporary African heritage. We reject modern hyper-industrialization, returning instead to deliberate proportions, natural materials, and hand craftsmanship.
            </p>
            <p>
              Every piece is carved from sustainable local woods—African mahogany, Iroko, and aged walnut—then hand-polished to showcase the organic grain pattern. We build not for temporary visual trends, but for generation-spanning permanence.
            </p>
          </div>

          <div className="h-[1px] bg-gold/25 w-full mb-8" />

          {/* Three countup statistics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { val: "120+", label: "Pieces Created" },
              { val: "14", label: "Years Active" },
              { val: "6", label: "Countries Served" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-2xl md:text-4xl text-gold-dim block mb-1 font-light leading-none">
                  {stat.val}
                </span>
                <span className="font-body text-[8px] tracking-widest text-txt-muted uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <a 
              href="#process" 
              {...hoverProps}
              className="inline-flex flex-col group font-body text-[9px] tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-300"
            >
              <span className="flex items-center gap-1">Our Story <ArrowRight className="w-3 h-3 stroke-[1.5]" /></span>
              <span className="h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-500 mt-1" />
            </a>
          </div>
        </div>
      </section>

      {/* 10. SECTION 05 — SIGNATURE INTERACTIVE CHAIR */}
      <section id="signature" className="w-full bg-[#15120F] text-cream py-20 md:py-32 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: Product Images layout */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              className="relative w-full aspect-square bg-dark flex items-center justify-center p-8 border border-white/5 overflow-hidden group select-none"
              onMouseEnter={() => setIsSigHovered(true)}
              onMouseLeave={() => setIsSigHovered(false)}
            >
              {/* Main image with transition crossfade */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeSigIdx + (isSigHovered ? "-hovered" : "-normal")}
                  src={isSigHovered ? signatureImages[activeSigIdx].back : signatureImages[activeSigIdx].front}
                  alt="The Architect Chair" 
                  className="absolute w-4/5 h-4/5 object-contain z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Number overlay */}
              <span id="active-piece-indicator" className="absolute bottom-4 left-4 font-body text-[9px] tracking-widest text-gold uppercase z-30">
                {signatureImages[activeSigIdx].label}
              </span>
              
              {/* Radial gradient backing */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,150,90,0.15)_0%,transparent_60%)] pointer-events-none z-0" />
            </div>

            {/* Thumbnails list selector */}
            <div className="flex space-x-4 mt-6 justify-center w-full">
              {signatureImages.map((thumb, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSigIdx(idx)}
                  {...hoverProps}
                  className={`w-20 h-20 bg-dark p-2 border focus:outline-none transition-colors duration-300 ${
                    activeSigIdx === idx ? "border-gold" : "border-transparent hover:border-gold/50"
                  }`}
                >
                  <img src={thumb.front} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Specifications panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
              Signature Piece
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-cream leading-none mb-3">
              The Architect Chair
            </h2>
            <p className="font-display italic text-gold-light text-sm mb-6 font-light">
              A dialogue of suspension, balance, and hand-stitched leather.
            </p>
            <p className="font-body text-xs md:text-sm text-neutral-400 leading-relaxed mb-8">
              Sculpted by hand in our Lagos workshop, The Architect Chair features a cantilevered carbon-steel frame that seems to defy gravity. Upholstered in full-grain Cordovan leather that patinas beautifully over time.
            </p>

            {/* Specs tables */}
            <div className="border-t border-white/5 mb-8 text-xs font-body uppercase tracking-wider">
              {[
                { title: "Material", val: "Full-Grain Leather, Black Steel" },
                { title: "Dimensions", val: "82cm × 68cm × 74cm" },
                { title: "Lead Time", val: "8 to 12 Weeks" },
                { title: "Origin", val: "Lagos, Nigeria" },
              ].map((spec) => (
                <div key={spec.title} className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-neutral-500">{spec.title}</span>
                  <span className="text-cream text-right">{spec.val}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-b border-white/5 items-baseline">
                <span className="text-neutral-500">Price</span>
                <span className="text-gold text-lg md:text-xl font-display lowercase tracking-normal font-light">
                  From ₦520,000
                </span>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => handleRequestQuote("The Architect Chair", "₦520,000", "seating")}
                {...hoverProps}
                className="flex-1 relative overflow-hidden inline-block bg-gold text-black text-center border border-gold px-6 py-4 text-[9px] tracking-widest uppercase font-body group"
              >
                <span className="absolute inset-0 bg-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="relative z-10 font-medium">Request a Quote</span>
              </button>

              <button 
                onClick={() => handleAddToWishlist("The Architect Chair", "₦520,000", signatureImages[0].front)}
                {...hoverProps}
                className="flex-1 relative overflow-hidden inline-block border border-white/10 px-6 py-4 text-[9px] tracking-widest uppercase text-cream text-center font-body group transition-colors duration-500 focus:outline-none"
              >
                <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out origin-bottom" />
                <span className="relative z-10 font-medium">Add to Wishlist</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 11. SECTION 05B — BESPOKE PRODUCT CATALOG */}
      <section id="shop" className="w-full bg-cream py-20 md:py-32 px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-8">
          <div>
            <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
              The Catalog
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-dark mb-4">
              Bespoke Curation
            </h2>
            <p className="font-body text-xs md:text-sm text-txt-muted max-w-xl">
              A selection of hand-finished items available for immediate order and custom sizing.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {["all", "seating", "tables", "bedroom", "office", "custom"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                {...hoverProps}
                className={`font-body text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                  activeCategory === cat ? "text-gold border-b border-gold pb-1" : "text-txt-muted hover:text-dark pb-1 border-b border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.filter(prod => activeCategory === "all" || prod.category === activeCategory).slice(0, 8).map((prod) => (
            <div key={prod.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                <img 
                  src={prod.image} 
                  alt={prod.product} 
                  className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-105 origin-center" 
                />
                
                {/* Overlay actions drawer on hover */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
                  <button 
                    onClick={() => handleRequestQuote(prod.product, prod.price, prod.category)}
                    {...hoverProps}
                    className="bg-gold text-black font-body text-[9px] tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors duration-300 w-44 text-center font-medium cursor-pointer"
                  >
                    Request Quote
                  </button>
                  <button 
                    onClick={() => handleAddToWishlist(prod.product, prod.price, prod.image)}
                    {...hoverProps}
                    className="border border-white/20 hover:border-gold hover:text-gold text-cream font-body text-[9px] tracking-widest uppercase px-6 py-2.5 transition-colors duration-300 w-44 text-center font-medium cursor-pointer"
                  >
                    Save to Wishlist
                  </button>
                </div>
              </div>

              {/* Specifications row below */}
              <div className="mt-4 flex flex-col space-y-1">
                <span className="font-body text-[8px] tracking-widest text-gold uppercase font-semibold">
                  {prod.category}
                </span>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-display text-lg text-dark group-hover:text-gold transition-colors duration-300">
                    {prod.product}
                  </h4>
                  <span className="font-display text-gold text-sm font-light">
                    {prod.price}
                  </span>
                </div>
                <span className="font-body text-[9px] text-txt-muted">
                  {prod.spec}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Full Showroom Catalog CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-[1px] bg-gradient-to-r from-gold/25 via-gold to-gold/25">
            <button
              onClick={() => {
                setCurrentView("catalog");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              {...hoverProps}
              className="bg-black text-cream hover:bg-gold hover:text-black font-body text-[10px] tracking-[0.2em] uppercase px-10 py-5 transition-all duration-300 font-semibold cursor-pointer"
            >
              Explore Full Showroom Catalog ({PRODUCTS.length}+ Pieces)
            </button>
          </div>
          <p className="font-body text-[9px] tracking-widest text-txt-muted uppercase mt-4">
            Filter, search, and browse our complete library of bespoke designs
          </p>
        </div>
      </section>

      {/* 12. SECTION 06 — RAW MATERIALS CARDS */}
      <section id="materials" className="w-full bg-cream py-20 md:py-32 px-6 md:px-12 overflow-hidden">
        <div className="mb-16">
          <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
            Premium Raw Materials
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-dark mb-4">
            Built From The Finest
          </h2>
          <p className="font-body text-xs md:text-sm text-txt-muted max-w-xl">
            We travel continents to source raw materials, pairing rare imported marbles with structural steel and cured West African timbers.
          </p>
        </div>

        {/* Horizontal scroll lists */}
        <div 
          ref={materialsRef}
          onScroll={handleMaterialsScroll}
          className="flex space-x-6 overflow-x-auto no-scrollbar pb-8 select-none scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {MATERIALS.map((mat, i) => (
            <div key={i} className="flex-shrink-0 w-72 md:w-80 group">
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
                <img 
                  src={mat.image} 
                  alt={mat.name} 
                  className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-105 origin-center" 
                />
                <div className="absolute inset-0 bg-gold/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="mt-4">
                <h4 className="font-display text-lg text-dark">{mat.name}</h4>
                <p className="font-body text-[10px] text-txt-muted uppercase tracking-wider">
                  {mat.origin}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll tracker indicator bar */}
        <div className="mt-6 w-full h-[1px] bg-neutral-200 relative">
          <div 
            className="absolute top-0 left-0 h-[2px] bg-gold transition-all duration-100"
            style={{ width: `${materialsProgress}%` }}
          />
        </div>
      </section>

      {/* 13. SECTION 07 — FULL BREED PARALLAX BANNER */}
      <section className="relative h-[80vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Parallax Image under backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600')",
            backgroundAttachment: isDesktop ? "fixed" : "scroll"
          }}
        />
        
        {/* Overlay darkness filter */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Quote text overlay */}
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <h2 className="font-display font-light text-cream text-3xl md:text-5xl lg:text-6xl leading-tight mb-8">
            &ldquo;Furniture Is Not Decoration.<br />It Is How You Choose To Live.&rdquo;
          </h2>
          <div className="h-[1px] bg-gold w-3/4 mx-auto max-w-md" />
        </div>
      </section>

      {/* 14. SECTION 08 — CREATION TIMELINE / PROCESS */}
      <section id="process" className="w-full bg-cream py-20 md:py-32 px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
            Creation Timeline
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-dark mb-4">
            From Concept To Home
          </h2>
          <p className="font-body text-xs md:text-sm text-txt-muted max-w-xl">
            Every commission goes through a systematic journey of consultation, validation, and manual carving before delivery.
          </p>
        </div>

        {/* Horizontal steps columns (Desktop only) */}
        <div className="relative hidden md:block mt-16 px-4 pb-12">
          {/* Rule background path line */}
          <div className="absolute top-[24px] left-0 right-0 h-[1px] bg-neutral-200 z-0" />
          
          <div className="grid grid-cols-4 gap-12 relative z-20">
            {[
              { id: "01", title: "Private Consultation", desc: "We align on spatial scale, functional intents, and material preferences in our showroom or your residence." },
              { id: "02", title: "Material Curation", desc: "Timber logs are inspected, marble slabs selected, and hardware finishes curated specifically for your piece." },
              { id: "03", title: "Master Crafting", desc: "Carved, assembled, and finished by master joiners in our Lagos atelier. Joints are hand-shaped and tested." },
              { id: "04", title: "White Glove Delivery", desc: "Transported securely and placed in your room by our internal installation team, ensuring balance and placement." },
            ].map((step) => (
              <div key={step.id} className="flex flex-col">
                <span className="w-12 h-12 flex items-center justify-center font-display text-4xl font-light text-gold mb-8 bg-cream relative z-30 select-none">
                  {step.id}
                </span>
                <span className="font-body text-[10px] tracking-widest text-dark uppercase mb-3 font-semibold">
                  {step.title}
                </span>
                <p className="font-body text-xs text-txt-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical steps stack list (Mobile layout only) */}
        <div className="relative md:hidden mt-8 pl-8 flex flex-col space-y-12">
          <div className="absolute left-[14px] top-4 bottom-4 w-[1px] bg-neutral-200 z-0" />
          
          {[
            { id: "01", title: "Private Consultation", desc: "We align on spatial scale, functional intents, and material preferences in our showroom or your residence." },
            { id: "02", title: "Material Curation", desc: "Timber logs are inspected, marble slabs selected, and hardware finishes curated specifically for your piece." },
            { id: "03", title: "Master Crafting", desc: "Carved, assembled, and finished by master joiners in our Lagos atelier. Joints are hand-shaped and tested." },
            { id: "04", title: "White Glove Delivery", desc: "Transported securely and placed in your room by our internal installation team, ensuring balance and placement." },
          ].map((step) => (
            <div key={step.id} className="relative z-20 flex flex-col">
              <span className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-cream text-gold font-display text-2xl flex items-center justify-center z-30 select-none font-light">
                {step.id}
              </span>
              <span className="font-body text-[10px] tracking-widest text-dark uppercase mb-2 font-semibold">
                {step.title}
              </span>
              <p className="font-body text-xs text-txt-muted max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-display italic text-xs md:text-sm text-txt-muted">
            Average lead time: 8 to 12 weeks
          </p>
        </div>
      </section>

      {/* 15. SECTION 09 — TESTIMONIAL CAROUSEL */}
      <section className="w-full bg-cream-dark py-20 md:py-32 px-6 md:px-12 flex flex-col items-center">
        <div className="max-w-4xl text-center flex flex-col items-center min-h-[300px] justify-between relative">
          
          <span className="font-display text-gold-dim text-7xl md:text-8xl leading-none opacity-20 -mb-6 select-none">
            &ldquo;
          </span>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mb-8"
            >
              <blockquote className="font-display italic text-dark text-xl md:text-3xl lg:text-4xl leading-relaxed px-4 md:px-12">
                &ldquo;{TESTIMONIALS[activeTestimonial].quote}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center mt-6">
                <span className="font-body text-[10px] tracking-widest text-gold uppercase mb-1 font-semibold">
                  {TESTIMONIALS[activeTestimonial].author}
                </span>
                <span className="font-body text-[8px] tracking-widest text-txt-muted uppercase">
                  {TESTIMONIALS[activeTestimonial].title}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots and Navigation Arrows */}
          <div className="flex justify-between items-center w-full mt-10 max-w-xs">
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              {...hoverProps}
              className="p-2 text-txt-muted hover:text-gold transition-colors duration-300 focus:outline-none"
            >
              <ChevronLeft className="w-6 h-6 stroke-[1.2]" />
            </button>

            <div className="flex space-x-3">
              {TESTIMONIALS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  {...hoverProps}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    activeTestimonial === idx ? "bg-gold scale-125" : "bg-gold/25 hover:bg-gold/50"
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
              {...hoverProps}
              className="p-2 text-txt-muted hover:text-gold transition-colors duration-300 focus:outline-none"
            >
              <ChevronRight className="w-6 h-6 stroke-[1.2]" />
            </button>
          </div>
        </div>
      </section>

      {/* 16. SECTION 10 — ASYMMETRIC GALLERY */}
      <section id="editorial" className="w-full bg-cream py-20 md:py-32 px-6 md:px-12">
        <div className="mb-16 text-center">
          <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-2 block">
            Shared Living Spaces
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-dark mb-3">
            As Lived In Your Home
          </h2>
          <span className="font-body text-[10px] tracking-widest text-gold uppercase">
            @visionworth
          </span>
        </div>

        {/* Masonry-like grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDITORIAL_IMAGES.map((img, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden bg-neutral-200 ${
                i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"
              }`}
            >
              <img 
                src={img.url} 
                alt={img.location} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
              />
              <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 pointer-events-none">
                <span className="font-body text-[9px] tracking-widest text-cream uppercase bg-black/60 px-4 py-2">
                  {img.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 17. SECTION 11 — SUBMISSION CONSULTATION INQUIRY */}
      <section id="newsletter" className="w-full bg-dark text-cream py-24 md:py-32 px-6 md:px-12 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          
          <div className="text-center mb-16">
            <span className="font-body text-[9px] tracking-widest text-gold uppercase mb-3 block">
              Begin Your Commission
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-cream mb-6">
              {formTitle}
            </h2>
            <p className="font-body text-xs md:text-sm text-text-light leading-relaxed max-w-md mx-auto">
              Tell us what you envision. Share your details below and our design team will reach out within 24 hours to begin your private consultation.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="w-full space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label htmlFor="client-name" className="font-body text-[8px] tracking-widest text-gold uppercase mb-3 font-semibold">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="client-name" 
                  placeholder="e.g. Adaeze Nwosu" 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-transparent text-cream border-b border-white/15 focus:border-gold focus:outline-none py-3 text-xs tracking-wider font-body placeholder-neutral-600 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="subscriber-email" className="font-body text-[8px] tracking-widest text-gold uppercase mb-3 font-semibold">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="subscriber-email" 
                  placeholder="you@example.com" 
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-transparent text-cream border-b border-white/15 focus:border-gold focus:outline-none py-3 text-xs tracking-wider font-body placeholder-neutral-600 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label htmlFor="client-phone" className="font-body text-[8px] tracking-widest text-gold uppercase mb-3 font-semibold">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="client-phone" 
                  placeholder="+234 801 234 5678" 
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-transparent text-cream border-b border-white/15 focus:border-gold focus:outline-none py-3 text-xs tracking-wider font-body placeholder-neutral-600 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="client-interest" className="font-body text-[8px] tracking-widest text-gold uppercase mb-3 font-semibold">
                  I'm Interested In
                </label>
                <select 
                  id="client-interest" 
                  required
                  value={formInterest}
                  onChange={(e) => setFormInterest(e.target.value)}
                  className="w-full bg-transparent text-cream border-b border-white/15 focus:border-gold focus:outline-none py-3 text-xs tracking-wider font-body appearance-none transition-colors duration-300 cursor-pointer"
                >
                  <option value="" disabled className="bg-dark text-neutral-500">Select a category</option>
                  <option value="seating" className="bg-dark">Seating</option>
                  <option value="tables" className="bg-dark">Tables & Dining</option>
                  <option value="bedroom" className="bg-dark">Bedroom Suite</option>
                  <option value="office" className="bg-dark">Workspace & Office</option>
                  <option value="custom" className="bg-dark">Fully Custom / Bespoke</option>
                  <option value="consultation" className="bg-dark">General Consultation</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="client-message" className="font-body text-[8px] tracking-widest text-gold uppercase mb-3 font-semibold">
                Your Brief
              </label>
              <textarea 
                id="client-message" 
                rows={3} 
                placeholder="Tell us about your space, dimensions, preferred materials, or any inspiration you have in mind..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full bg-transparent text-cream border-b border-white/15 focus:border-gold focus:outline-none py-3 text-xs tracking-wider font-body placeholder-neutral-600 transition-colors duration-300 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <span className="font-body text-[8px] tracking-widest text-neutral-500 uppercase">
                We respond within 24 hours. No spam, ever.
              </span>
              <button 
                type="submit" 
                {...hoverProps}
                className="relative overflow-hidden inline-block bg-gold text-black border border-gold px-10 py-4 text-[9px] tracking-widest uppercase font-body group"
              >
                <span className="absolute inset-0 bg-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="relative z-10 font-semibold">Submit Order Inquiry</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-black text-cream pt-20 pb-8 px-6 md:px-12 border-t border-white/5">
        
        <div className="text-center mb-16">
          <h2 className="font-display font-light text-3xl md:text-5xl text-cream tracking-[0.2em] uppercase leading-none select-none">
            <em className="text-gold not-italic font-display italic">A1</em>{" "}
            Vision Worth
          </h2>
          <p className="font-display italic text-[10px] text-gold/40 tracking-[0.25em] mt-3">
            Classic Nigeria Ltd.
          </p>
          <div className="divider-diamond w-full mt-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-body text-xs text-neutral-400 uppercase tracking-wider mb-20">
          <div className="flex flex-col space-y-4">
            <span className="font-display italic text-gold tracking-normal text-sm normal-case">
              "Building Vision with A1 Excellence"
            </span>
            <address className="not-italic text-neutral-400 leading-relaxed text-[11px] normal-case">
              A1 Visionworth Classic Nigeria Ltd.<br />
              57, Iwaya Road, Yaba, Lagos<br />
              Nigeria<br />
              <span className="text-neutral-500 text-[9px] uppercase tracking-wider">RC: 1299138</span>
            </address>
            <a href="tel:+2348054622076" {...hoverProps} className="text-neutral-400 hover:text-gold transition-colors duration-300 block text-[11px]">
              +234 805 462 2076
            </a>
            <a href="tel:+2348026572272" {...hoverProps} className="text-neutral-400 hover:text-gold transition-colors duration-300 block text-[11px]">
              +234 802 657 2272
            </a>
            <a href="mailto:slvisionwcinfo@gmail.com" {...hoverProps} className="text-neutral-400 hover:text-gold transition-colors duration-300 block text-[11px] normal-case">
              slvisionwcinfo@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-gold text-[10px] tracking-widest uppercase mb-6 font-semibold">Shop</h4>
            <ul className="space-y-3 text-[11px]">
              <li><a href="#collections" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Seating</a></li>
              <li><a href="#collections" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Tables</a></li>
              <li><a href="#collections" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Storage</a></li>
              <li><a href="#collections" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Lighting</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-[10px] tracking-widest uppercase mb-6 font-semibold">Company</h4>
            <ul className="space-y-3 text-[11px]">
              <li><a href="#philosophy" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Our Story</a></li>
              <li><a href="#process" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Workshop</a></li>
              <li><a href="#materials" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Showrooms</a></li>
              <li><a href="#newsletter" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-[10px] tracking-widest uppercase mb-6 font-semibold">Connect</h4>
            <ul className="space-y-3 text-[11px]">
              <li><a href="https://instagram.com" target="_blank" rel="noopener" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Instagram</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noopener" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">Pinterest</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener" {...hoverProps} className="hover:text-gold text-neutral-400 transition-colors duration-300">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] tracking-widest text-neutral-500">
          <div 
            id="copyright-text"
            onDoubleClick={() => setIsDashboardOpen(true)}
            className="mb-4 md:mb-0 cursor-help hover:text-gold transition-colors duration-300"
            title="Double click to view Client Inquiries Log"
          >
            &copy; 2026 Vision Worth. All Rights Reserved.
          </div>
          <div className="mb-4 md:mb-0 font-display italic text-[11px] text-neutral-400 normal-case">
            Handcrafted with intention.
          </div>
          <div className="flex space-x-6">
            <a href="#hero" {...hoverProps} className="hover:text-gold transition-colors duration-300">Back To Top</a>
          </div>
        </div>
      </footer>
        </>
      ) : (
        renderCatalogView()
      )}


      {/* --- FLOATING MODALS & DRAWERS --- */}

      {/* 18. Wishlist Right Sidebar Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div 
              className="fixed inset-0 bg-black/60 z-[950]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
            />

            {/* Sidebar element panel */}
            <motion.div
              id="wishlist-drawer"
              className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-dark text-cream z-[960] border-l border-white/5 flex flex-col p-6 md:p-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className="font-body text-[8px] tracking-[0.3em] text-gold uppercase mb-1 block">Your Curated Collection</span>
                  <h3 className="font-display font-light text-2xl tracking-wider text-cream">Wishlist</h3>
                </div>
                
                <button 
                  id="close-wishlist-drawer-btn" 
                  onClick={() => setIsWishlistOpen(false)}
                  {...hoverProps}
                  className="text-neutral-400 hover:text-gold transition-colors duration-300"
                >
                  <X className="w-6 h-6 stroke-[1.2]" />
                </button>
              </div>

              <div className="h-[1px] bg-gold/25 w-full mb-6" />

              {/* Wishlist item list */}
              <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-6">
                {wishlist.length === 0 ? (
                  <div id="empty-wishlist-msg" className="text-center py-20 text-neutral-500 font-body text-xs">
                    Your wishlist is currently empty.
                  </div>
                ) : (
                  wishlist.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 group border-b border-white/5 pb-4">
                      <img src={item.image} alt={item.product} className="w-16 h-20 object-cover bg-neutral-800" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-cream truncate">{item.product}</h4>
                        <p className="font-body text-[10px] text-gold tracking-widest mt-1">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromWishlist(index)}
                        {...hoverProps}
                        className="text-[9px] tracking-widest uppercase text-neutral-400 hover:text-red-400 font-body transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {wishlist.length > 0 && (
                <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                  <button 
                    id="wishlist-quote-btn" 
                    onClick={handleWishlistBulkInquiry}
                    {...hoverProps}
                    className="w-full relative overflow-hidden inline-block bg-gold text-black text-center border border-gold py-4 text-[9px] tracking-widest uppercase font-body group"
                  >
                    <span className="absolute inset-0 bg-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                    <span className="relative z-10 font-semibold">Inquire For All Saved Items</span>
                  </button>
                  <button 
                    id="clear-wishlist-items-btn" 
                    onClick={handleClearWishlist}
                    {...hoverProps}
                    className="w-full relative overflow-hidden inline-block bg-transparent text-neutral-400 text-center border border-white/10 hover:border-red-500/50 hover:text-red-400 py-4 text-[9px] tracking-widest uppercase font-body group transition-all duration-300"
                  >
                    <span className="relative z-10">Clear Wishlist</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 19. Receipt Modal details on Successful Form submission */}
      <AnimatePresence>
        {isReceiptOpen && activeInquiry && (
          <div 
            id="receipt-modal" 
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div 
              className="bg-dark text-cream border border-gold/30 p-8 md:p-12 max-w-lg w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button 
                id="close-receipt-btn" 
                onClick={() => setIsReceiptOpen(false)}
                {...hoverProps}
                className="absolute top-4 right-4 text-neutral-400 hover:text-gold transition-colors duration-300"
              >
                <X className="w-6 h-6 stroke-[1.2]" />
              </button>
              
              <span className="font-body text-[8px] tracking-[0.3em] text-gold uppercase mb-2 block">
                Commission Initiated
              </span>
              <h3 className="font-display font-light text-2xl md:text-3xl text-cream mb-6 tracking-wide">
                Inquiry Confirmation
              </h3>
              
              <div className="h-[1px] bg-gold/25 w-full mb-6" />
              
              <div className="space-y-4 font-body text-xs text-neutral-400 uppercase tracking-wider mb-8">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Ref Code</span>
                  <span id="receipt-ref" className="text-gold font-semibold">{activeInquiry.refCode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Client</span>
                  <span id="receipt-name" className="text-cream text-right">{activeInquiry.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Interest</span>
                  <span id="receipt-interest" className="text-cream text-right">
                    {activeInquiry.interest === "seating" && "Seating Catalog"}
                    {activeInquiry.interest === "tables" && "Tables & Dining"}
                    {activeInquiry.interest === "bedroom" && "Bedroom Suite"}
                    {activeInquiry.interest === "office" && "Workspace & Office"}
                    {activeInquiry.interest === "custom" && "Fully Bespoke"}
                    {activeInquiry.interest === "consultation" && "General Consultation"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Timeline</span>
                  <span className="text-cream text-right">Est. response &lt; 24 Hours</span>
                </div>
              </div>
              
              <p className="font-display italic text-xs text-neutral-400 leading-relaxed mb-8 normal-case text-center">
                "Your inquiry has been registered. You can also send this brief directly to our sales rep on WhatsApp to fast-track your commission."
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  id="whatsapp-receipt-btn" 
                  onClick={handleWhatsAppRedirect}
                  {...hoverProps}
                  className="w-full relative overflow-hidden inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-cream text-center py-4 text-[9px] tracking-widest uppercase font-body transition-colors duration-300 font-semibold"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.747 1.451 5.436.002 9.85-4.388 9.853-9.782.002-2.613-1.015-5.07-2.863-6.92C16.487 2.053 14.037 1.03 11.537 1.03c-5.441 0-9.859 4.39-9.863 9.785-.002 1.848.49 3.655 1.426 5.247l-.993 3.626 3.738-.977c1.517.825 3.011 1.267 4.199 1.267h.003z"/>
                  </svg>
                  Send Order to WhatsApp
                </button>
                <button 
                  id="ok-receipt-btn" 
                  onClick={() => setIsReceiptOpen(false)}
                  {...hoverProps}
                  className="w-full relative overflow-hidden inline-block bg-transparent text-neutral-400 text-center border border-white/10 hover:border-gold hover:text-gold py-4 text-[9px] tracking-widest uppercase font-body group transition-all duration-300 font-semibold"
                >
                  Done & Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 20. Easter Egg Admin Logs / Inquiries Dashboard (Double click copyright text to open) */}
      <AnimatePresence>
        {isDashboardOpen && (
          <div 
            id="leads-dashboard-modal" 
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90"
          >
            <motion.div 
              className="bg-dark text-cream border border-gold/30 p-8 md:p-12 max-w-4xl w-full h-[80vh] flex flex-col relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button 
                id="close-dashboard-btn" 
                onClick={() => setIsDashboardOpen(false)}
                {...hoverProps}
                className="absolute top-4 right-4 text-neutral-400 hover:text-gold transition-colors duration-300"
              >
                <X className="w-6 h-6 stroke-[1.2]" />
              </button>
              
              <span className="font-body text-[8px] tracking-[0.3em] text-gold uppercase mb-2 block font-semibold">
                System Log
              </span>
              <h3 className="font-display font-light text-2xl md:text-3xl text-cream mb-6 tracking-wide">
                Client Inquiries Log
              </h3>
              
              <div className="h-[1px] bg-gold/25 w-full mb-6" />
              
              {/* Logs table content */}
              <div className="flex-1 overflow-y-auto mb-8 pr-2 no-scrollbar">
                {inquiries.length === 0 ? (
                  <div id="no-leads-msg" className="text-center py-24 text-neutral-500 font-body text-xs">
                    No inquiries have been registered yet.
                  </div>
                ) : (
                  <table className="w-full text-left font-body text-[10px] tracking-wider uppercase border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-500 pb-3">
                        <th className="py-3 font-medium">Ref Code</th>
                        <th className="py-3 font-medium">Client</th>
                        <th className="py-3 font-medium">Contact</th>
                        <th className="py-3 font-medium">Interest</th>
                        <th className="py-3 font-medium">Message/Brief</th>
                        <th className="py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      {inquiries.map((inq, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                          <td className="py-4 text-gold font-semibold">{inq.refCode}</td>
                          <td className="py-4 text-cream font-medium normal-case">{inq.name}</td>
                          <td className="py-4 text-neutral-400 lowercase font-mono leading-relaxed normal-case">
                            {inq.phone}<br />{inq.email}
                          </td>
                          <td className="py-4 text-cream">
                            {inq.interest === "seating" && "Seating"}
                            {inq.interest === "tables" && "Tables"}
                            {inq.interest === "bedroom" && "Bedroom"}
                            {inq.interest === "office" && "Office"}
                            {inq.interest === "custom" && "Bespoke"}
                            {inq.interest === "consultation" && "Consult"}
                          </td>
                          <td className="py-4 text-neutral-400 normal-case max-w-xs truncate" title={inq.message}>
                            {inq.message || "—"}
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleDeleteInquiry(idx)}
                              {...hoverProps}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 uppercase font-body text-[9px] tracking-widest"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              {/* Reset logs row */}
              <div className="flex gap-4">
                {inquiries.length > 0 && (
                  <button 
                    id="clear-leads-btn" 
                    onClick={handleClearInquiries}
                    {...hoverProps}
                    className="flex-1 border border-white/10 hover:border-red-500/50 hover:text-red-400 py-4 text-[9px] tracking-widest uppercase font-body transition-all duration-300 font-semibold"
                  >
                    Clear All Logs
                  </button>
                )}
                <button 
                  id="close-dashboard-btn-ok" 
                  onClick={() => setIsDashboardOpen(false)}
                  {...hoverProps}
                  className="flex-1 bg-gold text-black border border-gold hover:bg-gold-light py-4 text-[9px] tracking-widest uppercase font-body transition-all duration-300 font-semibold"
                >
                  Close Log Viewer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
