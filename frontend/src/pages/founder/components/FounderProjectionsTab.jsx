import React from "react";
import ProjectionModelTab from "../../cfo/components/ProjectionModelTab";

export default function FounderProjectionsTab({ loadingProjections, projectionData, formatRupiah, valuation }) {
  return (
    <section id="projections" className="space-y-6">
      {loadingProjections ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : projectionData && projectionData.length > 0 ? (
        <div className="overflow-x-auto">
          <ProjectionModelTab data={projectionData} formatRupiah={formatRupiah} valuation={valuation} />
        </div>
      ) : (
        <div className="text-center p-12 text-muted-foreground bg-card border border-border rounded-2xl">
          Data asumsi belum tersedia. Silakan hubungi tim CFO untuk mengatur asumsi finansial.
        </div>
      )}
    </section>
  );
}
