import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 h-full max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Restaurant Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your location and QR codes</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Generate table-specific QR codes for Dine-In orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="space-y-2">
              <Label>Start Table #</Label>
              <Input type="number" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label>End Table #</Label>
              <Input type="number" defaultValue="10" />
            </div>
          </div>
          <Button className="gap-2">
            <QrCode className="w-4 h-4" /> Generate QR Batch
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Restaurant Name</Label>
            <Input defaultValue="Mfood" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label>Email Support</Label>
              <Input defaultValue="hello@mfood.com" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-6 mt-6">
          <Button variant="default">Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
