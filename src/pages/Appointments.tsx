import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  hospitalName: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  symptoms: string;
  address?: string;
  phone?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  appointments: Appointment[];
}

const Appointments = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Enhanced demo appointments with more details
    const enhancedAppointments = [
      {
        id: "app-1",
        hospitalName: "City General Hospital",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "confirmed" as const,
        symptoms: "Chest pain evaluation",
        address: "123 Medical Center Dr, City, State 12345",
        phone: "(555) 123-4567"
      },
      {
        id: "app-2",
        hospitalName: "Community Health Center",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending" as const,
        symptoms: "Follow-up consultation",
        address: "456 Healthcare Ave, City, State 12345",
        phone: "(555) 987-6543"
      },
      {
        id: "app-3",
        hospitalName: "Emergency Medical Center",
        date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: "confirmed" as const,
        symptoms: "Emergency consultation based on AI assessment",
        address: "789 Emergency Blvd, City, State 12345",
        phone: "(555) 911-1234"
      }
    ];
    
    setAppointments(enhancedAppointments);
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-secondary text-secondary-foreground";
      case "pending": return "bg-accent text-accent-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "cancelled" as const }
          : apt
      )
    );
    
    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been successfully cancelled.",
    });
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status !== "cancelled" && new Date(apt.date) > new Date()
  );
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date) <= new Date() || apt.status === "cancelled"
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground">Manage your healthcare appointments</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button variant="medical" asChild>
            <Link to="/chat">Book New Appointment</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card className="shadow-medical mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Appointments ({upcomingAppointments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button variant="medical" asChild>
                  <Link to="/chat">Schedule Your First Appointment</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-foreground">{appointment.hospitalName}</h3>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(appointment.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.address}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{appointment.phone}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Reason: {appointment.symptoms}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          {appointment.status !== "cancelled" && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Past Appointments ({pastAppointments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-foreground">{appointment.hospitalName}</h4>
                            <Badge className={getStatusColor(appointment.status)} variant="secondary">
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(appointment.date)} at {formatTime(appointment.date)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;