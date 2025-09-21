import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function QuickActions() {
  const handleEmergencyReport = () => {
    // TODO: Implement emergency reporting modal/flow
    alert('Emergency reporting feature - would open emergency contact form');
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card border border-border rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center space-x-6">
          <Link href="/identify">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2"
              data-testid="button-quick-snap"
            >
              <i className="fas fa-camera"></i>
              <span className="hidden sm:inline text-sm">Quick Snap</span>
            </Button>
          </Link>
          <Link href="/centers">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2"
              data-testid="button-find-centers"
            >
              <i className="fas fa-map-marked-alt"></i>
              <span className="hidden sm:inline text-sm">Find Centers</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2"
            onClick={handleEmergencyReport}
            data-testid="button-report-emergency"
          >
            <i className="fas fa-exclamation-triangle"></i>
            <span className="hidden sm:inline text-sm">Report Emergency</span>
          </Button>
          <Link href="/learn">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2"
              data-testid="button-learn"
            >
              <i className="fas fa-book-open"></i>
              <span className="hidden sm:inline text-sm">Learn</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
