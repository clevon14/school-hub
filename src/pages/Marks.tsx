import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { markService } from "@/services/markService";
import type { Mark } from "@/types/mark";

export default function Marks() {
  const [marks, setMarks] = useState<Mark[]>([]);
  useEffect(() => { markService.getAll().then(setMarks); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Marks</h1>
      <Table>
        <TableHeader><TableRow><TableHead>Exam</TableHead><TableHead>Student</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
        <TableBody>
          {marks.map((m) => (<TableRow key={m.id}><TableCell>Exam #{m.examId}</TableCell><TableCell>Student #{m.studentId}</TableCell><TableCell>{m.marksObtained}</TableCell><TableCell className="font-medium">{m.grade}</TableCell></TableRow>))}
        </TableBody>
      </Table>
    </div>
  );
}
