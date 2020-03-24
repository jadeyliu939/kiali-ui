import { ResourcePermissions } from './Permissions';
import { MetricsQuery } from '@kiali/k-charted-pf4';

export interface Iter8Info {
  enabled: boolean;
  permissions: ResourcePermissions;
}

export interface Iter8Experiment {
  name: string;
  phase: string;
  targetService?: string;
  status: string;
  baseline: string;
  baselinePercentage: number;
  candidate: string;
  candidatePercentage: number;
  namespace: string;
  startedAt: number;
  endedAt: number;
}

export interface ExpId {
  namespace: string;
  name: string;
}

export interface Iter8ExpDetailsInfo {
  experimentItem: ExperimentItem;
  criterias: SuccessCriteria[];
}

export interface ExperimentItem {
  name: string;
  phase: string;
  status: string;
  labels?: { [key: string]: string };
  createdAt: string;
  startedAt: number;
  endedAt: number;
  resourceVersion: string;
  baseline: string;
  baselinePercentage: number;
  candidate: string;
  candidatePercentage: number;
  namespace: string;
  targetService: string;
  targetServiceNamespace: string;
  assessmentConclusion: string;
}
export interface SuccessCriteria {
  name: string;
  criteria: Criteria;
  metric: Metric;
}
export interface Metric {
  absent_value: string;
  is_count: boolean;
  query_template: string;
  sample_size_template: string;
}
export interface Criteria {
  metric: string;
  tolerance: number;
  toleranceType: string;
  sampleSize: number;
  stopOnFailure: boolean;
}

export interface Iter8MetricsOptions extends MetricsQuery {
  direction: Direction;
  filters?: string[];
  requestProtocol?: string;
  reporter: Reporter;
  charts?: string;
  startTime?: number;
  endTime?: number;
  timeWindowType?: string;
}

export type Reporter = 'source' | 'destination';
export type Direction = 'inbound' | 'outbound';
