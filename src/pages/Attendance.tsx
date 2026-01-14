import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { attendanceService } from "@/services/attendanceService";
import type { Attendance } from "@/types/attendance";

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => { attendanceService.getByDate(date).then(setAttendance); }, [date]);

  const statusColors = { present: "text-green-600", absent: "text-red-600", late: "text-orange-600" };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      <div className="mb-4">
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="max-w-xs" />
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {attendance.map((a) => (
            <TableRow key={a.id}><TableCell>{a.studentName}</TableCell><TableCell className={`font-medium capitalize ${statusColors[a.status]}`}>{a.status}</TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
