Welcome to Vote Monitor Data Viz!

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

# Getting data from DB

```sql
select "Level1",
       "Level2",
       "Level3",
       "Level4",
       "Level5",
       "Address",
       trim(
               concat_ws(' ',
                         NULLIF("Level1", ''),
                         NULLIF("Level2", ''),
                         NULLIF("Level3", ''),
                         NULLIF("Level4", ''),
                         NULLIF("Level5", ''),
                         NULLIF("Address", '')
               )
       )                                                                        AS "FullAddress",
       coalesce(count(distinct ps."Id"), 0)                                     as "NumberOfPollingStations",
       coalesce(count(distinct qr."Id"), 0)                                     as "QuickReportsSubmitted",
       coalesce(count(distinct fs."Id"), 0)                                     as "FormSubmitted",
       coalesce(count(distinct psi."Id"), 0)                                    as "PSISubmitted",
       coalesce(sum(fs."NumberOfQuestionsAnswered"), 0)                         as "NumberOfQuestionsAnswered",
       coalesce(sum(fs."NumberOfFlaggedAnswers"), 0)                            as "NumberOfFlaggedAnswers",
       coalesce(count(distinct fs."MonitoringObserverId"), 0)                   as "ObserversWithForms",
       coalesce(count(distinct qr."MonitoringObserverId"), 0)                   as "ObserversWithQuickReports",
       coalesce(count(distinct psi."MonitoringObserverId"), 0)                  as "ObserversWithPSI",
       (select count(*)
        from unnest(array_remove(array_agg(fs."MonitoringObserverId") ||
                                 array_agg(qr."MonitoringObserverId") ||
                                 array_agg(psi."MonitoringObserverId"), NULL))) as "TotalObservers"

from "PollingStations" ps
         left join "FormSubmissions" fs on fs."PollingStationId" = ps."Id"
         left join "QuickReports" qr on qr."PollingStationId" = ps."Id"
         left join "PollingStationInformation" psi on psi."PollingStationId" = ps."Id"
where ps."ElectionRoundId" = '9e68d49a-4466-418d-bfad-bc1099db9778'
group by "Level1", "Level2", "Level3", "Level4", "Level5", "Address"
```
