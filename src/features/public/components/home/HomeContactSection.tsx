import { HomeContactForm } from "@/features/public/components/home/HomeContactForm";
import { HomeContactInfo } from "@/features/public/components/home/HomeContactInfo";
import { PublicSection } from "@/features/public/components/PublicSection";
import { useContactForm } from "@/features/public/hooks/useContactForm";

export function HomeContactSection() {
  const { formData, isSubmitting, handleFieldChange, handleSubmit } = useContactForm();

  return (
    <PublicSection id="contact" className="relative bg-card/20 py-20 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <HomeContactInfo />
        <HomeContactForm
          formData={formData}
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </div>
    </PublicSection>
  );
}
