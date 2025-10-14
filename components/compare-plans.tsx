"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ComparePlans() {
  const sections = [
    {
      title: "Platform Access & Users",
      rows: [
        {
          feature: "Empower Dashboard Access",
          values: ["5 Users", "10 Users", "25 Users", "50 Users"],
        },
        {
          feature: "End-user Training for Empower",
          values: ["—", "✓", "✓", "✓"],
        },
        {
          feature: "Parallel Automation Execution",
          values: ["—", "✓", "✓", "✓"],
        },
      ]
    },
    {
      title: "Reporting & Analytics",
      rows: [
        {
          feature: "Record-Level Reporting & Telemetry",
          values: ["✓", "✓", "✓", "✓"],
        },
        {
          feature: "Custom Dashboards",
          values: ["—", "-", "✓", "✓"],
        },
      ]
    },
    {
      title: "Support & Success",
      rows: [
        {
          feature: "Response Time (Support)",
          values: ["<24 hrs", "<12 hrs", "<6 hrs", "<1 hrs"],
        },
        {
          feature: "Customer Success Architect",
          values: ["-", "Optional", "Dedicated", "VIP"],
        },
      ]
    },
    {
      title: "Strategic Planning & Reviews",
      rows: [
        {
          feature: "ROI Reviews / Business Analysis",
          values: ["—", "2 / Year", "4 / Year", "12 / Year"],
        },
        {
          feature: "Art of the Possible Sessions",
          values: ["—", "1 / Year", "2 / Year", "4 / Year"],
        },
        {
          feature: "Outcome and Value Milestone Alignment",
          values: ["—", "✓", "✓", "✓"],
        },
        {
          feature: "Systems Access and As-Is Process Reviews",
          values: ["—", "✓", "✓", "✓"],
        },
      ]
    },
    {
      title: "Process Engineering & Documentation",
      rows: [
        {
          feature: "Process Re-Engineering",
          values: ["—", "—", "✓", "✓"],
        },
        {
          feature: "Master Automation Plan (MAP) Documentation",
          values: ["—", "—", "✓", "✓"],
        },
        {
          feature: "Functional Test Planning",
          values: ["—", "Basic", "✓", "✓"],
        },
      ]
    },
    {
      title: "Monitoring & Performance",
      rows: [
        {
          feature: "24/7 Proactive Performance Monitoring",
          values: ["—", "—", "✓", "✓"],
        },
        {
          feature: "Industry-leading Guaranteed Service Uptime of 99.5% (SLA)",
          values: ["—", "—", "✓", "✓"],
        },
        {
          feature: "Proactive Monitoring and Performance Optimizations",
          values: ["—", "—", "✓", "✓"],
        },
      ]
    }
  ]

  const planNames = ["Launch", "Elevate", "Advance", "Pinnacle"]

  return (
    <div className="mt-24 text-left">
      <h3 className="text-2xl font-semibold text-center mb-10">Compare Plans</h3>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {planNames.map((name) => (
                <TableHead key={name} className="text-center">
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={`section-${sectionIndex}`}>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={5} className="font-semibold text-sm uppercase tracking-wide py-3">
                    {section.title}
                  </TableCell>
                </TableRow>
                {section.rows.map((row, rowIndex) => (
                  <TableRow key={`${sectionIndex}-${rowIndex}`}>
                    <TableCell className="font-medium pl-6">{row.feature}</TableCell>
                    {row.values.map((value, i) => (
                      <TableCell
                        key={i}
                        className={`text-center ${
                          value === "✓" ? "text-primary font-semibold" : "text-foreground"
                        }`}
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-center text-sm mt-6 text-muted-foreground">
        Need a tailored plan or more analytics access?{" "}
        <a href="/contact" className="text-primary font-medium hover:underline">
          Contact Oakridge Automation
        </a>{" "}
        for a custom quote.
      </p>
    </div>
  )
}
