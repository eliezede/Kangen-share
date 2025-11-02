import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Ban, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { AvailabilityRule, AvailabilityException } from "@shared/schema";

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAYS = [
  { value: "mon" as DayOfWeek, label: "Monday" },
  { value: "tue" as DayOfWeek, label: "Tuesday" },
  { value: "wed" as DayOfWeek, label: "Wednesday" },
  { value: "thu" as DayOfWeek, label: "Thursday" },
  { value: "fri" as DayOfWeek, label: "Friday" },
  { value: "sat" as DayOfWeek, label: "Saturday" },
  { value: "sun" as DayOfWeek, label: "Sunday" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i >= 12 ? "PM" : "AM"}` };
});

export default function Availability() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [exceptionDate, setExceptionDate] = useState("");
  const [exceptionType, setExceptionType] = useState<"available" | "unavailable">("unavailable");

  const { data: rules, isLoading } = useQuery<AvailabilityRule[]>({
    queryKey: ["/api/availability/rules"],
  });

  const { data: exceptions, isLoading: exceptionsLoading } = useQuery<AvailabilityException[]>({
    queryKey: ["/api/availability/exceptions"],
  });

  const createRuleMutation = useMutation({
    mutationFn: async (data: { rruleText: string; timezone: string; startDate: string; startTime: string; endTime: string; description: string }) => {
      await apiRequest("POST", "/api/availability/rules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/rules"] });
      setIsDialogOpen(false);
      setSelectedDays([]);
      setStartTime("09:00");
      setEndTime("17:00");
      toast({
        title: "Success",
        description: "Availability rule created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      await apiRequest("DELETE", `/api/availability/rules/${ruleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/rules"] });
      toast({
        title: "Success",
        description: "Availability rule deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createExceptionMutation = useMutation({
    mutationFn: async (data: { date: string; type: "add" | "remove"; startTime: string; endTime: string }) => {
      await apiRequest("POST", "/api/availability/exceptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/exceptions"] });
      setIsExceptionDialogOpen(false);
      setExceptionDate("");
      setExceptionType("unavailable");
      toast({
        title: "Success",
        description: "Exception added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteExceptionMutation = useMutation({
    mutationFn: async (exceptionId: string) => {
      await apiRequest("DELETE", `/api/availability/exceptions/${exceptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/exceptions"] });
      toast({
        title: "Success",
        description: "Exception deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateRule = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day",
        variant: "destructive",
      });
      return;
    }

    const dayMap: Record<DayOfWeek, string> = {
      mon: "MO", tue: "TU", wed: "WE", thu: "TH",
      fri: "FR", sat: "SA", sun: "SU",
    };
    
    const byDay = selectedDays.map((d) => dayMap[d]).join(",");
    const rruleText = `FREQ=WEEKLY;BYDAY=${byDay}`;
    const now = new Date();
    const description = `${selectedDays.map(d => DAYS.find(day => day.value === d)?.label).join(", ")} ${startTime}-${endTime}`;

    createRuleMutation.mutate({ 
      rruleText, 
      timezone: "UTC", 
      startDate: now.toISOString(),
      startTime,
      endTime,
      description,
    });
  };

  const handleApplyPreset = (preset: { days: DayOfWeek[]; start: string; end: string; desc: string }) => {
    const dayMap: Record<DayOfWeek, string> = {
      mon: "MO", tue: "TU", wed: "WE", thu: "TH",
      fri: "FR", sat: "SA", sun: "SU",
    };
    
    const byDay = preset.days.map((d) => dayMap[d]).join(",");
    const rruleText = `FREQ=WEEKLY;BYDAY=${byDay}`;
    const now = new Date();
    
    createRuleMutation.mutate({ 
      rruleText, 
      timezone: "UTC", 
      startDate: now.toISOString(),
      startTime: preset.start,
      endTime: preset.end,
      description: preset.desc,
    });
  };

  const formatRuleDescription = (rule: AvailabilityRule) => {
    return rule.description || "Weekly recurring";
  };

  const handleCreateException = () => {
    if (!exceptionDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    createExceptionMutation.mutate({
      date: exceptionDate,
      type: exceptionType === "available" ? "add" : "remove",
      startTime,
      endTime,
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Availability Calendar</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your availability for water sharing requests
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-availability" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Availability Rule</DialogTitle>
              <DialogDescription>
                Set recurring weekly availability for water sharing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Days of the Week</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day.value}
                      variant={selectedDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day.value)}
                      data-testid={`button-day-${day.value}`}
                    >
                      {day.label.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger data-testid="select-start-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger data-testid="select-end-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRule} 
                disabled={createRuleMutation.isPending}
                data-testid="button-save-rule"
              >
                Save Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
          <CardDescription>Recurring weekly availability</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : rules && rules.length > 0 ? (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                  data-testid={`rule-${rule.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatRuleDescription(rule)}</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.timezone}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRuleMutation.mutate(rule.id)}
                    data-testid={`button-delete-rule-${rule.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No availability set yet. Add your first available time slot.
              </p>
            </div>
          )}
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleApplyPreset({
                days: ["mon", "tue", "wed", "thu", "fri"],
                start: "08:00",
                end: "12:00",
                desc: "Weekday Mornings 8AM-12PM",
              })}
              disabled={createRuleMutation.isPending}
              data-testid="button-preset-weekday-mornings"
            >
              Apply
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Weekend Afternoons</p>
              <p className="text-sm text-muted-foreground">Saturday-Sunday, 2PM-6PM</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleApplyPreset({
                days: ["sat", "sun"],
                start: "14:00",
                end: "18:00",
                desc: "Weekend Afternoons 2PM-6PM",
              })}
              disabled={createRuleMutation.isPending}
              data-testid="button-preset-weekend-afternoons"
            >
              Apply
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">All Week Flexible</p>
              <p className="text-sm text-muted-foreground">Monday-Sunday, 9AM-9PM</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleApplyPreset({
                days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                start: "09:00",
                end: "21:00",
                desc: "All Week Flexible 9AM-9PM",
              })}
              disabled={createRuleMutation.isPending}
              data-testid="button-preset-all-week"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Date Exceptions</CardTitle>
              <CardDescription>Override your schedule for specific dates</CardDescription>
            </div>
            <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" data-testid="button-add-exception">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exception
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Date Exception</DialogTitle>
                  <DialogDescription>
                    Mark a specific date as available or unavailable
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={exceptionDate}
                      onChange={(e) => setExceptionDate(e.target.value)}
                      data-testid="input-exception-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={exceptionType} onValueChange={(v) => setExceptionType(v as "available" | "unavailable")}>
                      <SelectTrigger data-testid="select-exception-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unavailable">Unavailable (block this date)</SelectItem>
                        <SelectItem value="available">Available (add this date)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExceptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateException} 
                    disabled={createExceptionMutation.isPending}
                    data-testid="button-save-exception"
                  >
                    Save Exception
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {exceptionsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : exceptions && exceptions.length > 0 ? (
            <div className="space-y-3">
              {exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                  data-testid={`exception-${exception.id}`}
                >
                  <div className="flex items-center gap-3">
                    {exception.type === "add" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Ban className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {format(new Date(exception.date), "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exception.type === "add" ? `Available ${exception.startTime}-${exception.endTime}` : "Unavailable"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExceptionMutation.mutate(exception.id)}
                    data-testid={`button-delete-exception-${exception.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No date exceptions set. Add exceptions to override your regular schedule.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
