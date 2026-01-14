import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { classService } from "@/services/classService";
import type { Class } from "@/types/class";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  useEffect(() => { classService.getAll().then(setClasses); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Classes</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Class</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Section</TableHead><TableHead>Students</TableHead></TableRow></TableHeader>
        <TableBody>
          {classes.map((c) => (<TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.section}</TableCell><TableCell>{c.studentCount}</TableCell></TableRow>))}
        </TableBody>
      </Table>
    </div>
  );
}
