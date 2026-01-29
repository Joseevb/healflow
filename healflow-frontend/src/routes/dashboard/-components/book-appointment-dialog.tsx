import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ApiProblemDetail } from "@/client";
import {
  createAppointmentMutation,
  getAvailableSpecialistsOptions,
  getPastAppointmentsOptions,
  getSpecialistBookingDataOptions,
  getUpcomingAppointmentsOptions,
} from "@/client/@tanstack/react-query.gen";
import Calendar from "@/components/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldSelect } from "@/components/ui/field-select";
import { Spinner } from "@/components/ui/spinner";

// TODO: use this to have multiple appointment dialog types
interface BookAppointmentDialogProps {
  type: "appointment" | "medication";
}

export default function BookAppointmentDialog() {
  const [selectedSpecialistId, setSelectedSpecialist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: specialistsResponse,
    isLoading: isLoadingSpecialists,
    error: specialistsError,
  } = useQuery(getAvailableSpecialistsOptions());

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const {
    data: bookingDataResponse,
    isLoading: isLoadingBookingData,
    isFetched: isFetchedBookingData,
    error: bookingDataError,
  } = useQuery({
    ...getSpecialistBookingDataOptions({
      path: {
        specialistId: selectedSpecialistId!,
      },
      query: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }),
    enabled: selectedSpecialistId !== null,
  });

  const { mutate, isPending: isLoadingCreateAppointment } = useMutation({
    ...createAppointmentMutation(),
    onSuccess: () => {
      toast.success("Appointment created successfully!");
      setDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: getUpcomingAppointmentsOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getPastAppointmentsOptions().queryKey,
      });
    },
    onError: (error) => {
      const apiError = (error as { data: ApiProblemDetail }).data;
      toast.error(apiError.detail || "Failed to create appointment");
    },
  });

  function action(date: Date, time: string) {
    date.setHours(Number.parseInt(time.split(":")[0]), Number.parseInt(time.split(":")[1]));

    mutate({
      body: {
        appointment_date: date.toISOString(),
        specialist_id: selectedSpecialistId!,
      },
    });
  }

  const fullyBookedDates =
    bookingDataResponse
      ?.filter((day) => day.timeslots.every((slot) => slot.status === "booked"))
      .map((day) => day.date) ?? [];

  const timeSlots =
    bookingDataResponse?.find(
      (day) => day.date.split("T")[0] === selectedDate?.toISOString().split("T")[0],
    )?.timeslots ?? [];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit p-6">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>Please select a date for the appointment</DialogDescription>
        </DialogHeader>
        {isLoadingSpecialists ? (
          <div className="py-4 flex gap-2 items-center justify-center text-sm text-muted-foreground">
            <Spinner />
            <span>Loading specialists...</span>
          </div>
        ) : specialistsError ? (
          <div className="py-4 text-center text-sm text-destructive">Error loading specialists</div>
        ) : (
          <FieldSelect
            data={
              specialistsResponse?.map((s) => ({
                value: s.id,
                label: s.name,
              })) ?? []
            }
            label="Specialist"
            placeholder="Choose a specialist"
            description="Select your specialist medic of choice"
            action={(item) => setSelectedSpecialist(item.value)}
          />
        )}
        {isFetchedBookingData && isLoadingBookingData ? (
          <div className="py-4 flex gap-2 items-center justify-center text-sm text-muted-foreground">
            <Spinner />
            <span>Loading availability...</span>
          </div>
        ) : bookingDataError ? (
          <div className="py-4 text-center text-sm text-destructive">
            Error loading availability
          </div>
        ) : (
          selectedSpecialistId &&
          bookingDataResponse && (
            <Calendar
              bookedDates={fullyBookedDates.map((date) => new Date(date))}
              timeSlots={timeSlots}
              action={action}
              onSelect={setSelectedDate}
              isLoading={isLoadingCreateAppointment}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
