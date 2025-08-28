import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MessageSquare, Calendar, User, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  hospitalName: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  symptoms: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    // Add some demo appointments if none exist
    if (!parsedUser.appointments || parsedUser.appointments.length === 0) {
      parsedUser.appointments = [
        {
          id: "app-1",
          hospitalName: "City General Hospital",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: "confirmed",
          symptoms: "Chest pain evaluation"
        },
        {
          id: "app-2",
          hospitalName: "Community Health Center",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          symptoms: "Follow-up consultation"
        }
      ];
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }
    
    setUser(parsedUser);
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
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's an overview of your health dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-medical transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Doctor</h3>
                  <p className="text-sm text-muted-foreground">Get instant advice</p>
                </div>
              </div>
              <Button variant="medical" className="w-full mt-4" asChild>
                <Link to="/chat">Start Chat</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Appointments</h3>
                  <p className="text-sm text-muted-foreground">{user.appointments.length} total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent/10 rounded-full">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Profile</h3>
                  <p className="text-sm text-muted-foreground">Age: {user.age}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Health Status</h3>
                  <p className="text-sm text-muted-foreground">Good</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card className="shadow-medical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Appointments</span>
              </CardTitle>
              <Button variant="outline" asChild>
                <Link to="/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {user.appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
                <Button variant="medical" className="mt-4" asChild>
                  <Link to="/chat">Book Your First Appointment</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{appointment.hospitalName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;