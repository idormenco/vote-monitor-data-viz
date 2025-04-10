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

# Getting raw data from DB

```sql
select "Level1",
       "Level2",
       "Level3",
       "Level4",
       "Level5",
       "Address",
       TRIM(
               CONCAT_WS(',',
                         NULLIF("Level1", ''),
                         NULLIF("Level2", ''),
                         NULLIF("Level3", ''),
                         NULLIF("Level4", ''),
                         NULLIF("Level5", ''),
                         NULLIF("Address", '')
               )
       )                                                                        AS "FullAddress",
       COALESCE(COUNT(DISTINCT ps."Id"), 0)                                     AS "NumberOfPollingStations",
       COALESCE(COUNT(DISTINCT qr."Id"), 0)                                     AS "QuickReportsSubmitted",
       COALESCE(COUNT(DISTINCT fs."Id"), 0)                                     AS "FormSubmitted",
       COALESCE(COUNT(DISTINCT psi."Id"), 0)                                    AS "PSISubmitted",
       COALESCE(SUM(fs."NumberOfQuestionsAnswered"), 0)                         AS "NumberOfQuestionsAnswered",
       COALESCE(SUM(fs."NumberOfFlaggedAnswers"), 0)                            AS "NumberOfFlaggedAnswers",
       COALESCE(COUNT(DISTINCT fs."MonitoringObserverId"), 0)                   AS "ObserversWithForms",
       COALESCE(COUNT(DISTINCT qr."MonitoringObserverId"), 0)                   AS "ObserversWithQuickReports",
       COALESCE(COUNT(DISTINCT psi."MonitoringObserverId"), 0)                  AS "ObserversWithPSI",
       (SELECT COUNT(*)
        FROM UNNEST(ARRAY_REMOVE(ARRAY_AGG(fs."MonitoringObserverId") ||
                                 ARRAY_AGG(qr."MonitoringObserverId") ||
                                 ARRAY_AGG(psi."MonitoringObserverId"), NULL))) AS "ActiveObservers",

       (SELECT COUNT(*)
        FROM UNNEST(ARRAY_REMOVE(ARRAY_AGG(fs."PollingStationId") ||
                                 ARRAY_AGG(qr."PollingStationId") ||
                                 ARRAY_AGG(psi."PollingStationId"), NULL))) AS "VisitedPollingStations"

FROM "PollingStations" ps
         LEFT JOIN "FormSubmissions" fs ON fs."PollingStationId" = ps."Id"
         LEFT JOIN "QuickReports" qr ON qr."PollingStationId" = ps."Id"
         LEFT JOIN "PollingStationInformation" psi ON psi."PollingStationId" = ps."Id"
WHERE ps."ElectionRoundId" = '9e68d49a-4466-418d-bfad-bc1099db9778'
GROUP BY "Level1", "Level2", "Level3", "Level4", "Level5", "Address"
```
