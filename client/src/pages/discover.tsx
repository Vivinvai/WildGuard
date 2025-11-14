import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Eye, MapPin, Heart, Play, BookOpen, Sparkles, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DiscoverAnimal } from "@shared/schema";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<DiscoverAnimal | null>(null);

  // Fetch all animals
  const { data: animals = [], isLoading } = useQuery<DiscoverAnimal[]>({
    queryKey: ["/api/discover-animals"],
  });

  // Fetch featured animals
  const { data: featuredAnimals = [] } = useQuery<DiscoverAnimal[]>({
    queryKey: ["/api/discover-animals/featured"],
  });

  // Mutation to track views (GET endpoint increments views as a side effect)
  const incrementViewMutation = useMutation({
    mutationFn: async (animalId: string) => {
      const response = await fetch(`/api/discover-animals/${animalId}`);
      if (!response.ok) throw new Error("Failed to fetch animal details");
      return response.json() as Promise<DiscoverAnimal>;
    },
    onSuccess: (updatedAnimal) => {
      // Update selected animal state with fresh view count
      setSelectedAnimal(updatedAnimal);
      // Invalidate queries to refresh view counts across the page
      queryClient.invalidateQueries({ queryKey: ["/api/discover-animals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/discover-animals/featured"] });
    },
    onError: (error) => {
      console.error("Failed to track animal view:", error);
    },
  });

  const handleAnimalClick = (animal: DiscoverAnimal) => {
    setSelectedAnimal(animal);
    // Fetch animal details and increment view count
    incrementViewMutation.mutate(animal.id);
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = !searchQuery ||
      animal.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.commonNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      animal.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || animal.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(animals.map(a => a.category)));

  const conservationColors: Record<string, string> = {
    "Endangered": "bg-red-500",
    "Critically Endangered": "bg-red-700",
    "Vulnerable": "bg-orange-500",
    "Near Threatened": "bg-yellow-500",
    "Least Concern": "bg-green-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNC00LTRzLTQgMi00IDRjMCAyIDIgNCA0IDRzNC0yIDQtNHptMCAwYzAtMiAyLTQgNC00czQgMiA0IDRjMCAyLTIgNC00IDRzLTQtMi00LTR6bS0yMCAwYzAtMiAyLTQgNC00czQgMiA0IDRjMCAyLTIgNC00IDRzLTQtMi00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center gap-2">
              <Sparkles className="w-12 h-12 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Discover Wildlife
              </h1>
              <Sparkles className="w-12 h-12 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
              Explore Karnataka's magnificent wildlife through videos, fascinating facts, and comprehensive information
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for tigers, elephants, leopards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-white/30 bg-white/95 dark:bg-gray-900/95 shadow-2xl focus:border-white transition-all"
                  data-testid="input-discover-search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Animals Carousel */}
      {featuredAnimals.length > 0 && (
        <div className="container mx-auto px-4 -mt-12 relative z-20 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Animals</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredAnimals.map((animal) => (
                <Card
                  key={animal.id}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleAnimalClick(animal)}
                  data-testid={`card-featured-animal-${animal.id}`}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={animal.imageUrl}
                        alt={animal.speciesName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={`${conservationColors[animal.conservationStatus] || 'bg-gray-500'} text-white font-semibold`}>
                          {animal.conservationStatus}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <Badge className="bg-black/70 text-white flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {animal.viewCount}
                        </Badge>
                        {animal.videoUrls.length > 0 && (
                          <Badge className="bg-red-600 text-white flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {animal.videoUrls.length}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{animal.speciesName}</h3>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-2">{animal.scientificName}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{animal.shortDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Categories */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Category:</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
            data-testid="button-category-all"
          >
            All Animals ({animals.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
              data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category} ({animals.filter(a => a.category === category).length})
            </Button>
          ))}
        </div>
        {selectedCategory && (
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className="mt-4 text-sm"
            data-testid="button-clear-filter"
          >
            <X className="w-4 h-4 mr-2" />
            Clear filter
          </Button>
        )}
      </div>

      {/* Animals Grid */}
      <div className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-56 w-full rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAnimals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <Card
                key={animal.id}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleAnimalClick(animal)}
                data-testid={`card-animal-${animal.id}`}
              >
                <CardContent className="p-0">
                  <div className="relative h-56 overflow-hidden rounded-t-lg">
                    <img
                      src={animal.imageUrl}
                      alt={animal.speciesName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${conservationColors[animal.conservationStatus] || 'bg-gray-500'} text-white font-semibold`}>
                        {animal.conservationStatus}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <Badge className="bg-black/70 text-white flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {animal.viewCount}
                      </Badge>
                      {animal.videoUrls.length > 0 && (
                        <Badge className="bg-red-600 text-white flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Watch Videos
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                          {animal.speciesName}
                        </h3>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">{animal.scientificName}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">{animal.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
                      {animal.shortDescription}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {animal.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No animals found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
          onClick={() => setSelectedAnimal(null)}
          data-testid="modal-animal-detail"
        >
          <div
            className="container mx-auto px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
              {/* Header with Image */}
              <div className="relative h-96 bg-gradient-to-br from-emerald-600 to-teal-600">
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.speciesName}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => setSelectedAnimal(null)}
                  data-testid="button-close-modal"
                >
                  <X className="w-6 h-6" />
                </Button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedAnimal.speciesName}</h2>
                      <p className="text-xl italic text-emerald-200">{selectedAnimal.scientificName}</p>
                      <div className="flex gap-2 mt-3">
                        {selectedAnimal.commonNames.slice(0, 3).map((name, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white/20 text-white border-white/40">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={`${conservationColors[selectedAnimal.conservationStatus] || 'bg-gray-500'} text-white font-bold text-lg px-4 py-2`}>
                      {selectedAnimal.conservationStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Videos Section */}
                {selectedAnimal.videoUrls.length > 0 && (
                  <div data-testid="section-videos">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Play className="w-6 h-6 text-red-600" />
                      Watch Videos
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedAnimal.videoUrls.map((url, idx) => (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow-lg" data-testid={`video-${idx}`}>
                          <iframe
                            src={url}
                            title={`${selectedAnimal.speciesName} Video ${idx + 1}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedAnimal.fullDescription}</p>
                </div>

                {/* Quick Facts Grid */}
                <div className="grid md:grid-cols-2 gap-6" data-testid="section-quick-facts">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg" data-testid="fact-habitat">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏠 Habitat</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAnimal.habitat}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg" data-testid="fact-diet">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🍽️ Diet</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAnimal.diet}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg" data-testid="fact-size">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📏 Size</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAnimal.size}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg" data-testid="fact-lifespan">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⏳ Lifespan</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAnimal.lifespan}</p>
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg" data-testid="section-fun-facts">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-600" />
                    Fun Facts
                  </h3>
                  <ul className="space-y-2">
                    {selectedAnimal.funFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-2xl">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Did You Know */}
                {selectedAnimal.didYouKnow && (
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-6 rounded-lg border-l-4 border-cyan-600" data-testid="section-did-you-know">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-cyan-600" />
                      Did You Know?
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedAnimal.didYouKnow}</p>
                  </div>
                )}

                {/* Cultural Significance */}
                {selectedAnimal.culturalSignificance && (
                  <div data-testid="section-cultural">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Cultural Significance</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedAnimal.culturalSignificance}</p>
                  </div>
                )}

                {/* Conservation */}
                <div className="border-t pt-6" data-testid="section-conservation">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conservation</h3>
                  
                  <div className="mb-4" data-testid="conservation-threats">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Threats</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnimal.threats.map((threat, idx) => (
                        <Badge key={idx} variant="destructive" data-testid={`threat-${idx}`}>{threat}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4" data-testid="conservation-efforts">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Conservation Efforts</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedAnimal.conservationEfforts}</p>
                  </div>

                  {selectedAnimal.protectedAreas && selectedAnimal.protectedAreas.length > 0 && (
                    <div data-testid="conservation-protected-areas">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Protected Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnimal.protectedAreas.map((area, idx) => (
                          <Badge key={idx} variant="secondary" data-testid={`protected-area-${idx}`}>{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
