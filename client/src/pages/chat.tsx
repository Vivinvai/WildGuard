import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { AIChat } from "@/components/ai-chat";
import { QuickActions } from "@/components/quick-actions";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background dark:bg-black pb-32">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <BackButton />
        {/* Hero Section */}
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-lg dark:shadow-blue-900/50">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            💬 AI Wildlife Assistant
          </h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 max-w-2xl mx-auto">
            Ask questions about wildlife conservation, animal behavior, and endangered species. Our AI assistant is here to help you learn and take action.
          </p>
        </div>

        {/* Chat Section */}
        <div className="max-w-3xl mx-auto">
          <AIChat />
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">What can you ask?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm mr-2">?</span>
                Species Information
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-8">
                <li>• "Tell me about Bengal tigers"</li>
                <li>• "What do elephants eat?"</li>
                <li>• "Where do red pandas live?"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 text-sm mr-2">!</span>
                Conservation Status
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-8">
                <li>• "Why are rhinos endangered?"</li>
                <li>• "How can I help tigers?"</li>
                <li>• "Conservation success stories"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm mr-2">🌍</span>
                Karnataka Wildlife
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-8">
                <li>• "Animals in Bandipur National Park"</li>
                <li>• "Karnataka bird species"</li>
                <li>• "Best wildlife sanctuaries to visit"</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm mr-2">🛡️</span>
                Action & Protection
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-8">
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