import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function QuickActions() {
  const handleEmergencyReport = () => {
    // TODO: Implement emergency reporting modal/flow
    alert('Emergency reporting feature - would open emergency contact form');
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-gradient-to-r from-white via-green-50 to-white border border-green-200 rounded-full shadow-2xl backdrop-blur-md px-8 py-4 hover:shadow-green-200/30 transition-all duration-300">
        <div className="flex items-center space-x-8">
          <Link href="/identify">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-green-600 hover:text-green-700 hover:bg-green-100/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-quick-snap"
            >
              <i className="fas fa-camera text-lg group-hover:scale-110 transition-transform"></i>
              <span className="hidden sm:inline text-xs font-medium">Quick Snap</span>
            </Button>
          </Link>
          <Link href="/centers">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-find-centers"
            >
              <i className="fas fa-map-marked-alt text-lg group-hover:scale-110 transition-transform"></i>
              <span className="hidden sm:inline text-xs font-medium">Find Centers</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-red-600 hover:text-red-700 hover:bg-red-100/50 transition-all duration-200 p-3 rounded-2xl group"
            onClick={handleEmergencyReport}
            data-testid="button-report-emergency"
          >
            <i className="fas fa-exclamation-triangle text-lg group-hover:scale-110 transition-transform"></i>
            <span className="hidden sm:inline text-xs font-medium">Emergency</span>
          </Button>
          <Link href="/learn">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 transition-all duration-200 p-3 rounded-2xl group"
              data-testid="button-learn"
            >
              <i className="fas fa-book-open text-lg group-hover:scale-110 transition-transform"></i>
              <span className="hidden sm:inline text-xs font-medium">Learn</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
