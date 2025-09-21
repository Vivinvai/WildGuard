import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animal image paths
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
}

const animalSlides: AnimalSlide[] = [
  {
    id: 1,
    image: tigerImage,
    title: "Bengal Tiger",
    description: "India's national animal and apex predator, representing strength and grace in the wild."
  },
  {
    id: 2,
    image: lionImage,
    title: "Asiatic Lion",
    description: "The only lions found outside Africa, exclusively residing in Gujarat's Gir Forest."
  },
  {
    id: 3,
    image: bustardImage,
    title: "Great Indian Bustard",
    description: "One of the world's heaviest flying birds, critically endangered with fewer than 200 remaining."
  },
  {
    id: 4,
    image: redPandaImage,
    title: "Red Panda",
    description: "An adorable endangered species found in the Himalayan foothills, known for its distinctive red fur."
  },
  {
    id: 5,
    image: elephantImage,
    title: "Indian Elephant",
    description: "Gentle giants and ecosystem engineers, playing a crucial role in maintaining forest biodiversity."
  }
];

export function AnimalSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % animalSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % animalSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + animalSlides.length) % animalSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentAnimal = animalSlides[currentSlide];

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="animal-slideshow"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentAnimal.image}
          alt={currentAnimal.title}
          className="w-full h-full object-cover object-center"
          data-testid={`slide-image-${currentSlide}`}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-300" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-shadow-lg">
            {currentAnimal.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium opacity-90 max-w-3xl mx-auto text-shadow">
            {currentAnimal.description}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 md:h-16 md:w-16"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 md:h-16 md:w-16"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {animalSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium">
        {currentSlide + 1} / {animalSlides.length}
      </div>
    </div>
  );
}