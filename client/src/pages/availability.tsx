import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";

export default function Availability() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Availability Calendar</h1>
          <p className="text-muted-foreground">
            Manage your availability for water sharing requests
          </p>
        </div>
        <Button data-testid="button-add-availability">
          <Plus className="w-4 h-4 mr-2" />
          Add Availability
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
          <CardDescription>Set recurring availability or specific time slots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No availability set yet. Add your first available time slot.
            </p>
            <Button variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Set Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
          <CardDescription>Common availability patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Weekday Mornings</p>
              <p className="text-sm text-muted-foreground">Monday-Friday, 8AM-12PM</p>
            </div>
            <Button variant="outline" size="sm">Apply</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Weekend Afternoons</p>
              <p className="text-sm text-muted-foreground">Saturday-Sunday, 2PM-6PM</p>
            </div>
            <Button variant="outline" size="sm">Apply</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">All Week Flexible</p>
              <p className="text-sm text-muted-foreground">Monday-Sunday, 9AM-9PM</p>
            </div>
            <Button variant="outline" size="sm">Apply</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
