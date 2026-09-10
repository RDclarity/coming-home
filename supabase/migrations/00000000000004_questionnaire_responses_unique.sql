-- Ein Mitglied kann einen Fragebogen erneut ausfüllen/aktualisieren, statt bei
-- jedem Absenden eine weitere Zeile anzulegen – braucht dafür eine
-- Eindeutigkeits-Regel, auf die sich ein "upsert" stützen kann.
alter table public.questionnaire_responses
  add constraint questionnaire_responses_unique unique (questionnaire_id, member_id);
