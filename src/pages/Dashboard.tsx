import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, IndianRupee, CalendarCheck } from "lucide-react";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";
import { feeService } from "@/services/feeService";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, collected: 0, pending: 0 });

  useEffect(() => {
    async function loadStats() {
      const [students, teachers, feeSummary] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        feeService.getSummary(),
      ]);
      setStats({
        students: students.length,
        teachers: teachers.length,
        collected: feeSummary.totalCollected,
        pending: feeSummary.totalDues,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { title: "Total Students", value: stats.students, icon: Users, color: "text-blue-600" },
    { title: "Total Teachers", value: stats.teachers, icon: GraduationCap, color: "text-green-600" },
    { title: "Fee Collected", value: `₹${stats.collected.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600" },
    { title: "Pending Dues", value: `₹${stats.pending.toLocaleString()}`, icon: CalendarCheck, color: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
