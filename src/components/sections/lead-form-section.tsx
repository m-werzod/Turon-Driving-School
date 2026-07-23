import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { LeadForm, type LeadPreselect } from "@/components/forms/lead-form";
import { getLeadFormOptions } from "@/server/lead-form";
import type { Locale } from "@/i18n/routing";

/**
 * Section-level lead form (TZ inline placements on category, express, contact,
 * register). Fetches its own options from the content service and renders the
 * form in a card with a heading. `id` lets in-page CTAs anchor-scroll to it.
 */
export async function LeadFormSection({
  locale,
  title,
  subtitle,
  preselect,
  id = "lead-form",
  className,
}: {
  locale: Locale;
  title: string;
  subtitle?: string;
  preselect?: LeadPreselect;
  id?: string;
  className?: string;
}) {
  const options = await getLeadFormOptions(locale);

  return (
    <Section id={id} className={className}>
      <div className="mx-auto max-w-2xl">
        <SectionHeading title={title} lead={subtitle} />
        <Card className="mt-8 p-6 sm:p-8">
          <LeadForm options={options} preselect={preselect} />
        </Card>
      </div>
    </Section>
  );
}
