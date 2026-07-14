import { CustomReportBuilderForm } from "../components/CustomReportBuilderForm";
import { GrowthReportsAccountComboBox } from "../components/GrowthReportsAccountComboBox";
import { useCustomReportBuilder } from "../hooks/useCustomReportBuilder";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function GrowthCustomReportBuilderPage() {
  const {
    values,
    reportableAccounts,
    isAccountsLoading,
    accountsError,
    accountsEmpty,
    isGenerating,
    toggleAccount,
    toggleMetric,
    changeField,
    generate,
  } = useCustomReportBuilder();

  return (
    <PageContent>
      <PageHeader
        heading="Custom Report Builder"
        description="Assemble a tailored report by selecting accounts, metrics, date range, and export format."
        actions={<GrowthReportsAccountComboBox />}
      />

      {accountsError ? <ErrorBanner message={accountsError} /> : null}

      <CustomReportBuilderForm
        values={values}
        accounts={reportableAccounts}
        isAccountsLoading={isAccountsLoading}
        accountsEmpty={accountsEmpty}
        isGenerating={isGenerating}
        onToggleAccount={toggleAccount}
        onToggleMetric={toggleMetric}
        onFieldChange={changeField}
        onGenerate={() => void generate()}
      />
    </PageContent>
  );
}
