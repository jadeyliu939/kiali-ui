import * as React from 'react';
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Grid,
  GridItem,
  List,
  ListItem,
  Stack,
  StackItem,
  Text,
  TextVariants
} from '@patternfly/react-core';
import './ExperimentInfoDescription.css';

import LocalTime from '../../../../components/Time/LocalTime';
// @ts-ignore
// import { ExperimentItem } from '../../../../types/iter8';
import { Link } from 'react-router-dom';
// import GraphDataSource from '../../../../services/GraphDataSource';
// import { App } from '../../../../types/App';
import { RenderComponentScroll } from '../../../../components/Nav/Page';
import CriteriaTable from './CriteriaTable';
import { Iter8ExpDetailsInfo } from '../../../../types/Iter8';
// import CustomMetricsContainer from '../../../../components/Metrics/CustomMetrics';
import Iter8eMtricsContainer from '../../../../components/Metrics/Iter8Metrics';
import { MetricsObjectTypes } from '../../../../types/Metrics';
// const cytoscapeGraphContainerStyle = style({ height: '300px' });

interface ExperimentInfoDescriptionProps {
  target: string;
  namespace: string;
  experimentDetails: Iter8ExpDetailsInfo;
  experiment: string;
  // app: App;
  // miniGraphDataSource: GraphDataSource;
}

class ExperimentInfoDescription extends React.Component<ExperimentInfoDescriptionProps> {
  serviceLink(namespace: string, workload: string) {
    return '/namespaces/' + namespace + '/services/' + workload;
  }

  serviceInfo() {
    // const ns = this.props.experimentItem.namespace ;

    return [
      <DataListCell key="service-icon" isIcon={true}>
        <Badge>S</Badge>
      </DataListCell>,
      <DataListCell key="targetService">
        <Text component={TextVariants.h3}>Service</Text>
      </DataListCell>
    ];
  }

  serviceLinkCell(namespace: string, bname: string) {
    return [
      <DataListCell key={bname}>
        <Text component={TextVariants.h3}>
          <Link to={this.serviceLink(namespace, bname)}>{bname}</Link>
        </Text>
      </DataListCell>
    ];
  }
  workloadLink(namespace: string, workload: string) {
    return '/namespaces/' + namespace + '/workloads/' + workload;
  }

  renderDeployments(baseline: string) {
    return (
      <ListItem key={`AppService_${baseline}`}>
        <Link to={this.workloadLink(this.props.namespace, baseline)}>{baseline}</Link>
      </ListItem>
    );
  }

  baselineInfo(bname: string, binfo: string) {
    // const ns = this.props.experimentItem.namespace ;
    const workloadList = this.renderDeployments(binfo);

    return [
      <DataListCell key="workload-icon" isIcon={true}>
        <Badge>W</Badge>
      </DataListCell>,
      <DataListCell key="baseline" className="resourceList">
        <Text component={TextVariants.h3}>{bname}</Text>
        <List>{workloadList}</List>
      </DataListCell>
    ];
  }

  percentageInfo(bname: string, bpercentage: number) {
    // const ns = this.props.experimentItem.namespace ;
    return [
      <DataListCell key={bname} className="resourceList">
        <Text component={TextVariants.h3}>Percentage</Text>
        <Text>{bpercentage} %</Text>
      </DataListCell>
    ];
  }

  render() {
    return (
      <RenderComponentScroll>
        <Grid gutter="md">
          <GridItem span={6}>
            <Card style={{ height: '100%' }}>
              <CardBody>
                <DataList aria-label="baseline and candidate">
                  <DataListItem aria-labelledby="Baseline">
                    <DataListItemRow>
                      <DataListItemCells dataListCells={this.serviceInfo()} />
                      <DataListItemCells
                        dataListCells={this.serviceLinkCell(this.props.namespace, this.props.target)}
                      />
                    </DataListItemRow>
                  </DataListItem>

                  <DataListItem aria-labelledby="Baseline">
                    <DataListItemRow>
                      <DataListItemCells
                        dataListCells={this.baselineInfo(
                          'Baseline',
                          this.props.experimentDetails.experimentItem.baseline
                        )}
                      />
                      <DataListItemCells
                        dataListCells={this.percentageInfo(
                          'Baseline',
                          this.props.experimentDetails.experimentItem.baselinePercentage
                        )}
                      />
                    </DataListItemRow>
                  </DataListItem>
                  <DataListItem aria-labelledby="Candidate">
                    <DataListItemRow>
                      <DataListItemCells
                        dataListCells={this.baselineInfo(
                          'Candidate',
                          this.props.experimentDetails.experimentItem.candidate
                        )}
                      />
                      <DataListItemCells
                        dataListCells={this.percentageInfo(
                          'Candidate',
                          this.props.experimentDetails.experimentItem.candidatePercentage
                        )}
                      />
                    </DataListItemRow>
                  </DataListItem>
                </DataList>

                <Stack>
                  <StackItem id={'Status'}>
                    <Text component={TextVariants.h3}> Status: </Text>
                    {this.props.experimentDetails.experimentItem.status}
                  </StackItem>

                  <StackItem id={'assessment'}>
                    <Text component={TextVariants.h3}> Assessment: </Text>
                    {this.props.experimentDetails.experimentItem.assessmentConclusion}
                  </StackItem>
                  <StackItem>
                    <Grid>
                      <GridItem span={6}>
                        <StackItem id={'started_at'}>
                          <Text component={TextVariants.h3}> Started at </Text>
                          <LocalTime time={this.props.experimentDetails.experimentItem.startedAt} />
                        </StackItem>
                      </GridItem>
                      <GridItem span={6}>
                        <StackItem id={'ended_at'}>
                          <Text component={TextVariants.h3}> Ended at </Text>
                          <LocalTime time={this.props.experimentDetails.experimentItem.endedAt} />
                        </StackItem>
                      </GridItem>
                    </Grid>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card style={{ height: '100%' }}>
              <CardBody>
                <Iter8eMtricsContainer
                  namespace={this.props.namespace}
                  object={this.props.target}
                  objectType={MetricsObjectTypes.ITER8}
                  direction={'inbound'}
                />
              </CardBody>
              <CardFooter>
                <CriteriaTable criterias={this.props.experimentDetails.criterias} />
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </RenderComponentScroll>
    );
  }
}

export default ExperimentInfoDescription;
