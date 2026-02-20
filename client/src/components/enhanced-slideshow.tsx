import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slideTransition } from "@/lib/motionConfig";

const tigerImage = "/attached_assets/a-g-YuQgNYku1M8-unsplash_1758459358190.jpg";
const lionImage = "/attached_assets/jorge-coromina-IVIF500p_hM-unsplash_1758459364909.jpg";
const bustardImage = "/attached_assets/great-indian-bustard-1_1758459373283.jpg";
const redPandaImage = "/attached_assets/thomas-bonometti-OyO5NDiRPMM-unsplash_1758459385691.jpg";
const elephantImage = "/attached_assets/iswanto-arif-cbNVRnlntZ8-unsplash_1758459400927.jpg";

interface AnimalSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  conservation: string;
}

const animalSlides: AnimalSlide[] = [
  {
    id: 1,
    image: tigerImage,
    title: "Bengal Tiger",
    description: "India's national animal and apex predator, representing strength and grace in the wild.",
    conservation: "Endangered"
  },
  {
    id: 2,
    image: lionImage,
    title: "Asiatic Lion",
    description: "The only lions found outside Africa, exclusively residing in Gujarat's Gir Forest.",
    conservation: "Endangered"
  },
  {
    id: 3,
    image: bustardImage,
    title: "Great Indian Bustard",
    description: "One of the world's heaviest flying birds, critically endangered with fewer than 200 remaining.",
    conservation: "Critically Endangered"
  },
  {
    id: 4,
    image: redPandaImage,
    title: "Red Panda",
    description: "An adorable endangered species found in the Himalayan foothills, known for its distinctive red fur.",
    conservation: "Endangered"
  },
  {
    id: 5,
    image: elephantImage,
    title: "Indian Elephant",
    description: "Gentle giants and ecosystem engineers, playing a crucial role in maintaining forest biodiversity.",
    conservation: "Endangered"
  }
];

export function EnhancedSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % animalSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % animalSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + animalSlides.length) % animalSlides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const currentAnimal = animalSlides[currentSlide];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-red-400/40 dark:ring-orange-500/30 border-2 border-orange-300 dark:border-red-500/50"
        data-testid="enhanced-slideshow"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 },
              opacity: { duration: 0.4, ease: "easeInOut" },
              scale: { duration: 0.4, ease: "easeOut" },
            }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <img
                src={currentAnimal.image}
                alt={currentAnimal.title}
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: "center 40%" }}
                data-testid={`slide-image-${currentSlide}`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`content-${currentSlide}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-8 left-8 right-8 md:left-12 md:bottom-12 z-10"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="inline-block mb-3"
            >
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border-2 shadow-lg ${
                currentAnimal.conservation === "Critically Endangered"
                  ? "bg-red-500/30 border-red-400/70 text-red-100 ring-2 ring-red-300/50"
                  : "bg-orange-500/30 border-orange-400/70 text-orange-100 ring-2 ring-orange-300/50"
              }`}>
                {currentAnimal.conservation}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-2xl"
            >
              {currentAnimal.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="text-base md:text-lg text-gray-100 drop-shadow-lg max-w-xl leading-relaxed"
            >
              {currentAnimal.description}
            </motion.p>
          </div>
        </motion.div>

        <div className="absolute top-6 right-6 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 rounded-full bg-red-500/20 backdrop-blur-md border-2 border-red-400/40 text-white hover:bg-red-500/30 hover:border-red-400/60 hover:text-white hover:scale-110 transition-all shadow-lg"
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-orange-500/20 backdrop-blur-md border-2 border-orange-400/50 text-white hover:bg-orange-500/30 hover:border-orange-400/70 hover:text-white hover:scale-110 transition-all z-10 shadow-lg"
          data-testid="button-prev-slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-orange-500/20 backdrop-blur-md border-2 border-orange-400/50 text-white hover:bg-orange-500/30 hover:border-orange-400/70 hover:text-white hover:scale-110 transition-all z-10 shadow-lg"
          data-testid="button-next-slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2.5 z-10 border border-red-400/30">
          {animalSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group"
              data-testid={`indicator-${index}`}
              aria-pressed={index === currentSlide}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-gradient-to-r from-red-400 via-orange-400 to-red-400"
                    : "w-1.5 bg-white/40 group-hover:bg-orange-400/80 group-hover:w-4"
                }`}
              />
            </button>
          ))}
        </div>

        <motion.div
          key={`progress-${currentSlide}`}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 z-10"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying ? "100%" : "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          data-testid="slideshow-progress"
        />
      </motion.div>
    </div>
  );
}
