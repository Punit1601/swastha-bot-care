import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Bot, User, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  needsLocation?: boolean;
  isSerious?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your AI health assistant. Please describe your symptoms or health concerns, and I'll help you understand what might be going on.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI logic for health assessment
  const analyzeSymptoms = (symptoms: string): { response: string; isSerious: boolean } => {
    const lowerSymptoms = symptoms.toLowerCase();
    
    // Serious symptoms that require immediate medical attention
    const seriousKeywords = [
      'chest pain', 'heart attack', 'stroke', 'seizure', 'unconscious',
      'difficulty breathing', 'shortness of breath', 'severe bleeding',
      'severe headache', 'high fever', 'fever above 103', 'blood pressure',
      'severe abdominal pain', 'unable to breathe', 'choking'
    ];

    // Minor symptoms
    const minorKeywords = [
      'cold', 'cough', 'headache', 'stomach ache', 'nausea',
      'sore throat', 'runny nose', 'sneezing', 'minor cut',
      'bruise', 'muscle ache', 'fatigue'
    ];

    const isSerious = seriousKeywords.some(keyword => lowerSymptoms.includes(keyword));
    const isMinor = minorKeywords.some(keyword => lowerSymptoms.includes(keyword));

    if (isSerious) {
      return {
        response: "⚠️ Your symptoms suggest a potentially serious condition that requires immediate medical attention. I recommend booking an appointment with the nearest hospital right away. Would you like me to help you find and book an appointment at a nearby hospital?",
        isSerious: true
      };
    } else if (isMinor) {
      return {
        response: "Based on your symptoms, this appears to be a minor health issue. Here are some recommendations:\n\n• Rest and stay hydrated\n• Take over-the-counter medication if needed\n• Monitor your symptoms\n• If symptoms worsen or persist for more than a few days, consider seeing a doctor\n\nIs there anything specific you'd like to know about managing these symptoms?",
        isSerious: false
      };
    } else {
      return {
        response: "I understand your concern. While I can provide general guidance, I'd recommend monitoring your symptoms closely. If you're worried or if symptoms worsen, it's always best to consult with a healthcare professional. Would you like me to help you find a nearby hospital or clinic?",
        isSerious: false
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const analysis = analyzeSymptoms(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: analysis.response,
        timestamp: new Date(),
        isSerious: analysis.isSerious,
        needsLocation: analysis.isSerious,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (analysis.isSerious) {
        setShowLocationPrompt(true);
      }
    }, 1500);
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simulate finding nearest hospital
        setTimeout(() => {
          const appointment = {
            id: `app-${Date.now()}`,
            hospitalName: "Emergency Medical Center",
            date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
            status: "confirmed" as const,
            symptoms: "Emergency consultation based on AI assessment"
          };

          // Update user data
          const userData = localStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            user.appointments = user.appointments || [];
            user.appointments.push(appointment);
            localStorage.setItem("user", JSON.stringify(user));
          }

          const successMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "bot",
            content: `✅ Great! I've found the nearest hospital and booked an appointment for you:\n\n🏥 **Emergency Medical Center**\n📍 Located 2.3 miles from your location\n⏰ **Appointment Time:** ${new Date(appointment.date).toLocaleString()}\n\nPlease head to the hospital as soon as possible. Your appointment has been confirmed and they're expecting you.`,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, successMessage]);
          setShowLocationPrompt(false);

          toast({
            title: "Appointment booked successfully!",
            description: "Check your dashboard for appointment details.",
          });

          // Redirect to dashboard after a delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        }, 2000);
      },
      (error) => {
        toast({
          title: "Location access denied",
          description: "Please enable location access to find nearby hospitals.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Health Assistant</h1>
          <p className="text-muted-foreground">Describe your symptoms for personalized health guidance</p>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col shadow-medical">
          <CardContent className="flex-1 overflow-hidden p-0">
            {/* Messages */}
            <div className="h-full overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-primary" : "bg-secondary"
                    }`}>
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isSerious
                        ? "bg-destructive/10 text-foreground border border-destructive/20"
                        : "bg-muted text-foreground"
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Location Prompt */}
            {showLocationPrompt && (
              <div className="p-6 border-t border-border">
                <Alert className="border-destructive/20 bg-destructive/5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <div className="flex items-center justify-between">
                      <span>Allow location access to find the nearest hospital?</span>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="destructive" onClick={handleLocationRequest}>
                          <MapPin className="w-4 h-4 mr-1" />
                          Allow Location
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowLocationPrompt(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your symptoms..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} variant="medical" disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;