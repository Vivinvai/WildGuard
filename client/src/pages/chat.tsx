import { Header } from "@/components/header";
import { AIChat } from "@/components/ai-chat";
import { QuickActions } from "@/components/quick-actions";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
            💬 AI Wildlife Assistant
          </h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Ask questions about wildlife conservation, animal behavior, and endangered species. Our AI assistant is here to help you learn and take action.
          </p>
        </div>

        {/* Chat Section */}
        <div className="max-w-3xl mx-auto">
          <AIChat />
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What can you ask?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm mr-2">?</span>
                Species Information
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-8">
                <li>• "Tell me about Bengal tigers"</li>
                <li>• "What do elephants eat?"</li>
                <li>• "Where do red pandas live?"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm mr-2">!</span>
                Conservation Status
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-8">
                <li>• "Why are rhinos endangered?"</li>
                <li>• "How can I help tigers?"</li>
                <li>• "Conservation success stories"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mr-2">🌍</span>
                Karnataka Wildlife
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-8">
                <li>• "Animals in Bandipur National Park"</li>
                <li>• "Karnataka bird species"</li>
                <li>• "Best wildlife sanctuaries to visit"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm mr-2">🛡️</span>
                Action & Protection
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-8">
                <li>• "How to report wildlife emergencies"</li>
                <li>• "Wildlife conservation careers"</li>
                <li>• "Support conservation organizations"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  );
}