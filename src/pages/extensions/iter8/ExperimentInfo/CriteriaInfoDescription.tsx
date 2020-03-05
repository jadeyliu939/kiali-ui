import * as React from 'react';
// @ts-ignore
import { Card, CardBody, Grid, GridItem, Stack, StackItem, Text, TextVariants, Title } from '@patternfly/react-core';
import './ExperimentInfoDescription.css';
// @ts-ignore
import { SuccessCriteria } from '../../../../types/iter8';

interface ExperimentInfoDescriptionProps {
  criterias: SuccessCriteria[];
}

class CriteriaInfoDescription extends React.Component<ExperimentInfoDescriptionProps> {
  render() {
    return (
      <Grid gutter="md">
        <GridItem span={12}>
          <Card style={{ height: '100%' }}>
            <CardBody>
              <Title headingLevel="h3" size="2xl">
                {' '}
                Success Criteria Details{' '}
              </Title>

              {this.props.criterias.map((criteria, idx) => {
                return (
                  <Stack gutter="md">
                    <StackItem id={'criteriaName_' + idx}>
                      <Text component={TextVariants.h3}> Name: </Text>
                      {criteria.name}
                    </StackItem>
                    <StackItem id={'tolerance'}>
                      <Text component={TextVariants.h3}> Tolerance: </Text>
                      {criteria.criteria.tolerance}
                    </StackItem>
                    <StackItem id={'toleranceType'}>
                      <Text component={TextVariants.h3}> Tolerance Type: </Text>
                      {criteria.criteria.toleranceType}
                    </StackItem>
                    <StackItem id={'sampleSize'}>
                      <Text component={TextVariants.h3}> Sample Size: </Text>
                      {criteria.criteria.sampleSize}
                    </StackItem>
                    <StackItem id={'stopOnFailuer'}>
                      <Text component={TextVariants.h3}> Stop on Failure: </Text>
                      {criteria.criteria.stopOnFailure}
                    </StackItem>
                    <StackItem id={'absentValue'}>
                      <Text component={TextVariants.h3}> Absent Value: </Text>
                      {criteria.metric.absent_value}
                    </StackItem>
                    <StackItem id={'isCount'}>
                      <Text component={TextVariants.h3}> Is Count: </Text>
                      {criteria.metric.is_count}
                    </StackItem>
                    <StackItem id={'queryTemplate'}>
                      <Text component={TextVariants.h3}> Query Temaplte: </Text>
                      {criteria.metric.query_template}
                    </StackItem>
                    <StackItem id={'sampleSizeTemplate'}>
                      <Text component={TextVariants.h3}> Sample Size Temaplte: </Text>
                      {criteria.metric.sample_size_template}
                    </StackItem>
                  </Stack>
                );
              })}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  }
}

export default CriteriaInfoDescription;
