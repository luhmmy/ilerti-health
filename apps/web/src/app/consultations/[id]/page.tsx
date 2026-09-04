"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/button";

export default function ConsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const [consultation, setConsultation] = useState<any>(null);

  useEffect(() => {
    async function loadConsultation() {
      if (params.id) {
        const data = await api.consultations.getById(params.id as string);
        setConsultation(data);
      }
    }
    loadConsultation();
  }, [params.id]);

  const handleEndSession = () => {
    // In a real app, we would call an API to end the session
    router.push(`/consultations/${params.id}/summary`);
  };

  if (!consultation) return <div className="p-8 text-center">Loading session...</div>;

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-800">Consultation Room</h1>
        <Button variant="destructive" onClick={handleEndSession}>
          End Session
        </Button>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Area */}
        <div className="md:col-span-2 bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
          <span className="text-white text-xl">Video Stream Active</span>
          {/* Mini self view */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-800 border-2 border-white rounded-lg flex items-center justify-center">
             <span className="text-white text-sm">You</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border p-4 flex-1 overflow-auto">
            <h2 className="font-semibold mb-4 border-b pb-2">Chat & Notes</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-gray-100 p-2 rounded inline-block max-w-[80%]">
                Hello, how can I help you today?
              </div>
              <div className="bg-teal-100 p-2 rounded inline-block max-w-[80%] ml-auto text-right w-full">
                I've been feeling unwell...
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
             <textarea 
               className="w-full border rounded p-2 text-sm focus:ring-teal-500" 
               placeholder="Type a message..."
               rows={3}
             />
             <Button className="w-full mt-2" size="sm">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
