'use client'

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRiskCategoryColor } from "@/lib/data";
import type { RiskAssessment } from "@/lib/types";
import { format } from "date-fns";
import { AlertDetailsSheet } from './alert-details-sheet';

type AlertsTableProps = {
  alerts: RiskAssessment[];
};

export function AlertsTable({ alerts }: AlertsTableProps) {
    const [selectedAlert, setSelectedAlert] = useState<RiskAssessment | null>(null);

  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAlerts.map((alert) => (
                <TableRow key={alert.id} onClick={() => setSelectedAlert(alert)} className="cursor-pointer" data-testid={`alert-row-${alert.id}`}>
                  <TableCell className="font-medium">{alert.location}</TableCell>
                  <TableCell>
                    <Badge
                      className="text-white"
                      style={{ backgroundColor: getRiskCategoryColor(alert.riskCategory) }}
                    >
                      {alert.riskCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono">{alert.riskScore}</TableCell>
                  <TableCell>
                    {format(new Date(alert.time), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDetailsSheet 
        alert={selectedAlert}
        open={!!selectedAlert}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedAlert(null);
            }
        }}
      />
    </>
  );
}
