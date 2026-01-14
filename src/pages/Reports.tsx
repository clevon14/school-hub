import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <Tabs defaultValue="students">
        <TabsList><TabsTrigger value="students">Students</TabsTrigger><TabsTrigger value="attendance">Attendance</TabsTrigger><TabsTrigger value="fees">Fees</TabsTrigger><TabsTrigger value="marks">Marks</TabsTrigger></TabsList>
        <TabsContent value="students"><Card><CardHeader><CardTitle>Student List Report</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Select a class to generate student list report.</p></CardContent></Card></TabsContent>
        <TabsContent value="attendance"><Card><CardHeader><CardTitle>Attendance Summary</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Select date range for attendance report.</p></CardContent></Card></TabsContent>
        <TabsContent value="fees"><Card><CardHeader><CardTitle>Fee Collection Report</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">View fee collection summary.</p></CardContent></Card></TabsContent>
        <TabsContent value="marks"><Card><CardHeader><CardTitle>Marks Report</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Select exam to view marks report.</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
