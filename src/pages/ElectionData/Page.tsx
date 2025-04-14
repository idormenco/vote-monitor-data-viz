import type { DataLevel, GIDData } from "@/common/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { Route } from "@/routes/elections/$id";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import ElectionDescription from "./Tabs/ElectionDescription";
import FlaggedAnswers from "./Tabs/FlaggedAnswers";
import FormSubmissions from "./Tabs/FormSubmissions";
import PollingStationsCoverage from "./Tabs/PollingStationsCoverage";
import ReportedIncidents from "./Tabs/QuickReports";
import { isUndefined } from "lodash-es";

export default function Page() {
  const { id } = Route.useParams();
  const { data: electionStatistics } = useSuspenseQuery(
    electionByIdQueryOptions(id)
  );

  const [selectedLevel, setSelectedLevel] = useState<DataLevel>("level0");

  const availableGidLevels = useMemo(() => {
    const levels: { value: DataLevel; label: string }[] = [];
    if (electionStatistics.gid0Data?.length > 0) {
      levels.push({
        value: "level0",
        label: electionStatistics.gidLevelLabels?.gid0 || "Level 0",
      });
    }

    if (electionStatistics.gid1Data?.length > 0) {
      levels.push({
        value: "level1",
        label: electionStatistics.gidLevelLabels?.gid1 || "Level 1",
      });
    }

    if (electionStatistics.gid2Data?.length > 0) {
      levels.push({
        value: "level2",
        label: electionStatistics.gidLevelLabels?.gid2 || "Level 2",
      });
    }

    if (electionStatistics.gid3Data?.length > 0) {
      levels.push({
        value: "level3",
        label: electionStatistics.gidLevelLabels?.gid3 || "Level 3",
      });
    }

    if (electionStatistics.gid4Data?.length > 0) {
      levels.push({
        value: "level4",
        label: electionStatistics.gidLevelLabels?.gid4 || "Level 4",
      });
    }

    return levels;
  }, [electionStatistics]);

  const LevelSelector = () => {
    if (availableGidLevels.length <= 1) return null;

    return (
      <div className="mb-4">
        <Select
          value={selectedLevel}
          onValueChange={(value) => setSelectedLevel(value as DataLevel)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {availableGidLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const levelToGidData = useCallback((level: string) => {
    if (level === "level0") return "gid0Data";
    if (level === "level1") return "gid1Data";
    if (level === "level2") return "gid2Data";
    if (level === "level3") return "gid3Data";
    if (level === "level4") return "gid4Data";

    throw new Error("Unmapped level received!");
  }, []);

  const levelToGid = useCallback((level: string) => {
    if (level === "level0") return "gid0";
    if (level === "level1") return "gid1";
    if (level === "level2") return "gid2";
    if (level === "level3") return "gid3";
    if (level === "level4") return "gid4";

    throw new Error("Unmapped level received!");
  }, []);

  const currentLevelData = useMemo(() => {
    return electionStatistics[levelToGidData(selectedLevel)] || [];
  }, [electionStatistics, selectedLevel]);

  const totals = useMemo(() => {
    return currentLevelData.reduce(
      (acc, row) => {
        acc.numberOfPollingStations += row.numberOfPollingStations;
        acc.quickReportsSubmitted += row.quickReportsSubmitted;
        acc.formSubmitted += row.formSubmitted;
        acc.psiSubmitted += row.psiSubmitted;
        acc.numberOfQuestionsAnswered += row.numberOfQuestionsAnswered;
        acc.numberOfFlaggedAnswers += row.numberOfFlaggedAnswers;
        acc.observersWithForms += row.observersWithForms;
        acc.observersWithQuickReports += row.observersWithQuickReports;
        acc.observersWithPSI += row.observersWithPSI;
        acc.activeObservers += row.activeObservers;
        acc.visitedPollingStations += row.visitedPollingStations;

        return acc;
      },
      {
        gid: "",
        gidName: "",
        numberOfPollingStations: 0,
        quickReportsSubmitted: 0,
        formSubmitted: 0,
        psiSubmitted: 0,
        numberOfQuestionsAnswered: 0,
        numberOfFlaggedAnswers: 0,
        observersWithForms: 0,
        observersWithQuickReports: 0,
        observersWithPSI: 0,
        activeObservers: 0,
        visitedPollingStations: 0,
      } as GIDData
    );
  }, [currentLevelData]);

  const currentMapId = useMemo(() => {
    const mapId = electionStatistics.gidLevelMaps[levelToGid(selectedLevel)];
    if (isUndefined(mapId)) throw new Error("Unconfigured map id");

    return mapId;
  }, [electionStatistics, selectedLevel]);

  const { data: features } = useSuspenseQuery(
    mapByCodeQueryOptions(currentMapId)
  );

  return (
    <div>
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ps-covered">Polling station coverage</TabsTrigger>
          <TabsTrigger value="forms-submitted">Forms submitted</TabsTrigger>
          <TabsTrigger value="flagged-answers">Flag answers</TabsTrigger>
          <TabsTrigger value="quick-reports">
            Quick reports submitted
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <ElectionDescription election={electionStatistics} />
        </TabsContent>
        <TabsContent value="ps-covered">
          <LevelSelector />
          <PollingStationsCoverage
            level={selectedLevel}
            mapFeatures={features}
            gidData={currentLevelData}
          />
        </TabsContent>

        <TabsContent value="forms-submitted">
          <LevelSelector />
          <FormSubmissions
            level={selectedLevel}
            mapFeatures={features}
            totals={totals}
            gidData={currentLevelData}
          />
        </TabsContent>
        <TabsContent value="flagged-answers">
          <LevelSelector />
          <FlaggedAnswers
            level={selectedLevel}
            mapFeatures={features}
            gidData={currentLevelData}
          />
        </TabsContent>
        <TabsContent value="quick-reports">
          <LevelSelector />
          <ReportedIncidents
            level={selectedLevel}
            mapFeatures={features}
            totals={totals}
            gidData={currentLevelData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
