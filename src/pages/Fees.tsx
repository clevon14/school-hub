import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, IndianRupee } from "lucide-react";
import { feeService } from "@/services/feeService";
import type { Fee, FeeSummary } from "@/types/fee";

export default function Fees() {
  const [pending, setPending] = useState<Fee[]>([]);
  const [paid, setPaid] = useState<Fee[]>([]);
  const [summary, setSummary] = useState<FeeSummary>({ totalDues: 0, totalCollected: 0, pendingCount: 0, paidCount: 0 });

  useEffect(() => {
    Promise.all([feeService.getPending(), feeService.getPaid(), feeService.getSummary()]).then(([p, pd, s]) => { setPending(p); setPaid(pd); setSummary(s); });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Fees</h1>
        <Button><Plus className="h-4 w-4 mr-2" />Add Fee</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Dues</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">₹{summary.totalDues.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Collected</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">₹{summary.totalCollected.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.pendingCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Paid</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.paidCount}</div></CardContent></Card>
      </div>
      <Tabs defaultValue="pending">
        <TabsList><TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="paid">Paid</TabsTrigger></TabsList>
        <TabsContent value="pending">
          <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{pending.map((f) => (<TableRow key={f.id}><TableCell>{f.studentName}</TableCell><TableCell>₹{f.amount.toLocaleString()}</TableCell><TableCell>{f.dueDate}</TableCell><TableCell><Button size="sm"><IndianRupee className="h-4 w-4 mr-1" />Record Payment</Button></TableCell></TableRow>))}</TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="paid">
          <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Amount</TableHead><TableHead>Paid On</TableHead><TableHead>Mode</TableHead></TableRow></TableHeader>
            <TableBody>{paid.map((f) => (<TableRow key={f.id}><TableCell>{f.studentName}</TableCell><TableCell>₹{f.amount.toLocaleString()}</TableCell><TableCell>{f.paidOn}</TableCell><TableCell>{f.mode}</TableCell></TableRow>))}</TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
