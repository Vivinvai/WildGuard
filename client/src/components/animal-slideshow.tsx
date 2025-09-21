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
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % animalSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
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
      className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-green-900 via-black to-orange-900 rounded-xl mx-4 my-6 shadow-2xl border border-green-400/20 slide-glow"
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-opacity duration-300" />

      {/* Content Overlay */}
      <div className="absolute bottom-6 left-6">
        <div className="text-left text-white max-w-xs">
          <h2 className="text-sm md:text-base font-bold mb-1 text-shadow-lg text-white">
            {currentAnimal.title}
          </h2>
          <p className="text-xs font-medium opacity-80 text-shadow leading-tight text-gray-200">
            {currentAnimal.description}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-green-400/30 hover:text-green-200 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-green-400/30 hover:text-green-200 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
        {animalSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-green-400 scale-150 shadow-lg shadow-green-400/50"
                : "bg-white/50 hover:bg-green-200/75 hover:scale-125"
            }`}
            data-testid={`indicator-${index}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-600/80 to-orange-600/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 shadow-lg">
        <span className="text-green-200">{currentSlide + 1}</span>
        <span className="text-white/70 mx-1">/</span>
        <span className="text-orange-200">{animalSlides.length}</span>
      </div>
    </div>
  );
}