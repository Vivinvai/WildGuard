import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Camera, MapPin, AlertTriangle, BookOpen } from "lucide-react";

export function QuickActions() {
  const handleEmergencyReport = () => {
    // TODO: Implement emergency reporting modal/flow
    alert('Emergency reporting feature - would open emergency contact form');
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-gradient-to-r from-white via-green-50 to-white dark:from-gray-900 dark:via-green-950/50 dark:to-gray-900 border border-green-200 dark:border-green-700 rounded-full shadow-2xl dark:shadow-green-900/50 backdrop-blur-md px-8 py-4 hover:shadow-green-200/30 dark:hover:shadow-green-800/50 transition-all duration-300">
        <div className="flex items-center space-x-8">
          <Link href="/identify">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100/50 dark:hover:bg-green-900/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-quick-snap"
            >
              <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Quick Snap</span>
            </Button>
          </Link>
          <Link href="/centers">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-find-centers"
            >
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Find Centers</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/50 transition-all duration-200 p-3 rounded-2xl group"
            onClick={handleEmergencyReport}
            data-testid="button-report-emergency"
          >
            <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-medium">Emergency</span>
          </Button>
          <Link href="/learn">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-100/50 dark:hover:bg-orange-900/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-learn"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Learn</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
