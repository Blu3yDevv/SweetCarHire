"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label: string
}

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !date ? "text-muted-foreground" : ""
            } rounded-xl border-pastel-pink/30 hover:border-pastel-pink bg-white/80 backdrop-blur-sm`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-xl" />
        </PopoverContent>
      </Popover>
    </div>
  )
}
