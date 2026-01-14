import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { teacherService } from "@/services/teacherService";
import type { Teacher } from "@/types/teacher";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => { teacherService.getAll().then(setTeachers); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Teacher</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Qualification</TableHead><TableHead>Phone</TableHead><TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell><TableCell>{t.email}</TableCell><TableCell>{t.subject}</TableCell><TableCell>{t.qualification}</TableCell><TableCell>{t.phone}</TableCell>
              <TableCell><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
