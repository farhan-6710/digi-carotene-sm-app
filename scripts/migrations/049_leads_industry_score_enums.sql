-- Migration 049 — Leads: industry, lead_score, expanded status/source enums.
-- Run only if you already applied the first version of 048_leads.sql.
-- Skip if you are applying the updated 048 for the first time.

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads drop constraint if exists leads_lead_source_check;

alter table public.leads
  add column if not exists industry text;

alter table public.leads
  add column if not exists lead_score integer;

update public.leads set lead_score = 1 where lead_score is null;

alter table public.leads
  alter column lead_score set default 1,
  alter column lead_score set not null;

alter table public.leads drop constraint if exists leads_lead_score_check;
alter table public.leads
  add constraint leads_lead_score_check check (lead_score between 1 and 5);

update public.leads set status = case status
  when 'new' then 'not_contacted'
  when 'qualified' then 'pre_qualified'
  when 'lost' then 'lost_lead'
  else status
end;

update public.leads set lead_source = case lead_source
  when 'website' then 'web_research'
  when 'referral' then 'employee_referral'
  when 'social' then 'facebook'
  when 'ads' then 'advertisement'
  when 'other' then 'cold_call'
  else lead_source
end;

alter table public.leads
  alter column status set default 'not_contacted';

alter table public.leads
  alter column lead_source set default 'cold_call';

alter table public.leads
  add constraint leads_status_check check (status in (
    'attempted_to_contact',
    'contact_in_future',
    'contacted',
    'junk_lead',
    'lost_lead',
    'not_contacted',
    'pre_qualified',
    'not_qualified'
  ));

alter table public.leads
  add constraint leads_lead_source_check check (lead_source in (
    'advertisement',
    'cold_call',
    'employee_referral',
    'external_referral',
    'online_store',
    'partner',
    'public_relations',
    'sales_email_alias',
    'seminar_partner',
    'internal_seminar',
    'trade_show',
    'web_download',
    'web_research',
    'chat',
    'x_twitter',
    'facebook'
  ));
