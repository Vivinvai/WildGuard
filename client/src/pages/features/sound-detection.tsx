import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Volume2, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SoundResult {
  speciesIdentified: string;
  scientificName: string;
  soundType: string;
  confidence: number;
  frequency: string;
  duration: number;
  conservationStatus: string;
  additionalNotes: string;
  habitatInfo: string;
}

export default function SoundDetection() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SoundResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) {
      toast({ title: "No audio file", description: "Please select an audio file first", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await fetch('/api/features/sound-detection', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze sound");

      const data = await response.json();
      setResults(data);
      toast({ title: "Analysis Complete", description: `Identified: ${data.speciesIdentified}` });
    } catch (error) {
      toast({ title: "Analysis Failed", description: "Could not analyze the audio file", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Wildlife Sound Detection
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Bioacoustic AI identifies species from bird calls, animal vocalizations, and wildlife sounds
          </p>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardTitle>Upload Wildlife Audio</CardTitle>
            <CardDescription className="text-purple-50">
              Upload audio recordings of bird calls, tiger roars, elephant trumpets, or other wildlife sounds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" id="audio-upload" />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Select Audio File</span>
                  </Button>
                </label>
                {audioFile && (
                  <p className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {audioFile.name}
                  </p>
                )}
              </div>

              <Button onClick={handleAnalyze} disabled={!audioFile || isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Sound...</>
                ) : (
                  <>Identify Species</>
                )}
              </Button>

              {results && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="p-5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {results.speciesIdentified}
                    </h3>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">{results.scientificName}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="text-sm"><strong>Sound Type:</strong> <span className="capitalize">{results.soundType}</span></div>
                      <div className="text-sm"><strong>Confidence:</strong> {(results.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Sound Characteristics</h4>
                      <p className="text-sm"><strong>Frequency:</strong> {results.frequency}</p>
                      <p className="text-sm"><strong>Duration:</strong> {results.duration}s</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Conservation Status</h4>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">{results.conservationStatus}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Analysis Notes</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{results.additionalNotes}</p>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Habitat Information</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{results.habitatInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
