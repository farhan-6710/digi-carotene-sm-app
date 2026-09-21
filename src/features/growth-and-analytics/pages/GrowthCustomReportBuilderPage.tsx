import { CustomReportBuilderForm } from "../components/custom-report/CustomReportBuilderForm";
import { CustomReportEmailModal } from "../components/custom-report/CustomReportEmailModal";
import { useCustomReportBuilder } from "../hooks/useCustomReportBuilder";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function GrowthCustomReportBuilderPage() {
  const {
    values,
    accounts,
    isAccountsLoading,
    accountsError,
    accountsEmpty,
    isGenerating,
    isSending,
    hasPdf,
    emailOpen,
    setEmailOpen,
    setKind,
    setPlatform,
    setAccounts,
    setPeriodId,
    setDate,
    generate,
    download,
    sendEmail,
  } = useCustomReportBuilder();

  return (
    <PageContent>
      <PageHeader
        heading="Custom Report Builder"
        description="Pick organic or ads accounts and a date range — the PDF includes all synced metrics for that period."
      />

      {accountsError ? <ErrorBanner message={accountsError} /> : null}

      <CustomReportBuilderForm
        values={values}
        accounts={accounts}
        isAccountsLoading={isAccountsLoading}
        accountsEmpty={accountsEmpty}
        isGenerating={isGenerating}
        hasPdf={hasPdf}
        onKindChange={setKind}
        onPlatformChange={setPlatform}
        onAccountsChange={setAccounts}
        onPeriodChange={setPeriodId}
        onDateChange={setDate}
        onGenerate={() => void generate()}
        onDownload={download}
        onOpenEmail={() => setEmailOpen(true)}
      />

      <CustomReportEmailModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        isSending={isSending}
        onSend={sendEmail}
      />
    </PageContent>
  );
}
