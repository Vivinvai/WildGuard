import { Card } from "@/components/ui/card";

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-paw text-primary-foreground text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WildlifeSave</h1>
              <p className="text-xs text-muted-foreground">AI Conservation Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Centers
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Learn
            </a>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <i className="fas fa-user mr-2"></i>Account
            </button>
          </nav>
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" data-testid="button-mobile-menu">
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
