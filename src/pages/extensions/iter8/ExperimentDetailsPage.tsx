import * as React from 'react';
import { RenderContent } from '../../../components/Nav/Page';

import { Link, RouteComponentProps } from 'react-router-dom';

import ParameterizedTabs, { activeTab } from '../../../components/Tab/Tabs';

import * as API from '../../../services/Api';
import * as AlertUtils from '../../../utils/AlertUtils';
import { Iter8Info, Iter8ExpDetailsInfo } from '../../../types/Iter8';

import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  Tab,
  Text,
  TextVariants,
  Toolbar,
  ToolbarSection
} from '@patternfly/react-core';
import ExperimentInfoDescription from './ExperimentInfo/ExperimentInfoDescription';
import CriteriaInfoDescription from './ExperimentInfo/CriteriaInfoDescription';
import { style } from 'typestyle';
import { PfColors } from '../../../components/Pf/PfColors';
import history from '../../../app/History';
import RefreshButtonContainer from '../../../components/Refresh/RefreshButton';
import RefreshContainer from '../../../components/Refresh/Refresh';
import GraphDataSource from '../../../services/GraphDataSource';
import { EdgeLabelMode, GraphType, NodeType } from '../../../types/Graph';
import { App } from '../../../types/App';

type ExpDetailsState = {
  iter8Info: Iter8Info;
  expDetailsInfo: Iter8ExpDetailsInfo;
  currentTab: string;
  app: App;
  dropdownOpen: boolean;
};

interface Props {
  namespace: string;
  name: string;
}

const containerWhite = style({ backgroundColor: PfColors.White });
const paddingLeft = style({ paddingLeft: '20px' });
const rightToolbar = style({ marginLeft: 'auto' });
const emptyExperiment: Iter8ExpDetailsInfo = {
  experimentItem: {
    name: '',
    phase: '',
    status: '',
    createdAt: '',
    startedAt: '',
    endedAt: '',
    resourceVersion: '',
    baseline: '',
    baselinePercentage: 0,
    candidate: '',
    candidatePercentage: 0,
    namespace: '',
    targetService: '',
    targetServiceNamespace: '',
    assessmentConclusion: ''
  },
  criterias: []
};

const emptyApp = {
  namespace: { name: '' },
  name: '',
  workloads: [],
  serviceNames: [],
  runtimes: []
};

const tabName = 'tab';
const defaultTab = 'info';
const criteriaTab = 'criteria';

const tabIndex: { [tab: string]: number } = {
  info: 0,
  criteria: 1
};

class ExperimentDetailsPage extends React.Component<RouteComponentProps<Props>, ExpDetailsState> {
  private graphDataSource: GraphDataSource;

  constructor(props: RouteComponentProps<Props>) {
    super(props);
    this.state = {
      iter8Info: {
        enabled: true,
        permissions: {
          create: true,
          update: true,
          delete: true
        }
      },
      currentTab: activeTab(tabName, defaultTab),
      expDetailsInfo: emptyExperiment,
      app: emptyApp,
      dropdownOpen: false
    };
    this.graphDataSource = new GraphDataSource();
  }

  componentDidMount() {
    this.doRefresh();
  }

  componentDidUpdate() {
    if (this.state.currentTab !== activeTab(tabName, defaultTab)) {
      this.setState(
        {
          currentTab: activeTab(tabName, defaultTab)
        },
        () => this.doRefresh()
      );
    }
  }

  doRefresh = () => {
    const currentTab = this.state.currentTab;

    if (currentTab === defaultTab) {
      this.setState(prevState => {
        return {
          iter8Info: prevState.iter8Info,
          expDetailsInfo: emptyExperiment,
          currentTab: currentTab
        };
      });
      this.fetchExperiment();
      // this.fetchApp();
    }

    if (currentTab === criteriaTab) {
      this.fetchExperiment();
    }
  };

  pageTitle = (title: string) => (
    <>
      <div className={`breadcrumb ${containerWhite} ${paddingLeft}`}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={'/extensions/iter8/list'}>Iter8 Experiment</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive={true}>{title}</BreadcrumbItem>
        </Breadcrumb>
        <Text component={TextVariants.h3}>{title}</Text>
      </div>
    </>
  );

  fetchExperiment = () => {
    API.getIter8Info()
      .then(result => {
        const iter8Info = result.data;
        if (iter8Info.enabled) {
          API.getExperiment(this.props.match.params.namespace, this.props.match.params.name)
            .then(result2 => {
              const expDetailsInfo = result2.data;
              API.getApp(
                expDetailsInfo.experimentItem.targetServiceNamespace,
                expDetailsInfo.experimentItem.targetService
              )
                .then(details => {
                  this.setState(prevState => {
                    this.loadMiniGraphData(
                      expDetailsInfo.experimentItem.targetServiceNamespace,
                      expDetailsInfo.experimentItem.targetService,
                      this.props.match.params.name
                    );
                    return {
                      app: details.data,
                      expDetailsInfo: result2.data,
                      currentTab: activeTab(tabName, defaultTab),
                      iter8Info: prevState.iter8Info
                    };
                  });
                })
                .catch(error => {
                  AlertUtils.addError('Could not fetch App Details.', error);
                });
            })
            .catch(error => {
              AlertUtils.addError('Could not fetch Iter8 Experiments.', error);
            });
        } else {
        }
      })
      .catch(error => {
        AlertUtils.addError('Could not fetch Iter8INfo.', error);
      });
  };

  // Invoke the history object to update and URL and start a routing
  goIter8Page = () => {
    history.push('/extensions/iter8');
  };

  staticTabs() {
    const overviewTab = (
      <Tab title="Overview" eventKey={0} key={'Overview'}>
        <ExperimentInfoDescription
          experimentDetails={this.state.expDetailsInfo}
          app={this.state.app}
          miniGraphDataSource={this.graphDataSource}
        />
      </Tab>
    );

    const criteriaTab = (
      <Tab title="Criteria" eventKey={1} key={'Traffic'}>
        <CriteriaInfoDescription criterias={this.state.expDetailsInfo.criterias} />
      </Tab>
    );
    return [overviewTab, criteriaTab];
  }

  handleTabClick = (_, tabIndex) => {
    this.setState({
      currentTab: tabIndex
    });
  };

  renderActions() {
    let component;
    switch (this.state.currentTab) {
      case defaultTab:
        component = (
          <Tab title="Overview" eventKey={0} key={'Overview'}>
            <ExperimentInfoDescription
              experimentDetails={this.state.expDetailsInfo}
              app={this.state.app}
              miniGraphDataSource={this.graphDataSource}
            />
          </Tab>
        );
        break;
      case criteriaTab:
        component = (
          <Tab title="Criteria" eventKey={0} key={'Criteria'}>
            <CriteriaInfoDescription criterias={this.state.expDetailsInfo.criterias} />
          </Tab>
        );
        break;

      default:
        return undefined;
    }
    return (
      <span style={{ position: 'absolute', right: '50px', zIndex: 1 }}>
        {component}
        {this.state.currentTab !== criteriaTab ? (
          <RefreshButtonContainer handleRefresh={this.doRefresh} />
        ) : (
          <RefreshContainer id="metrics-refresh" handleRefresh={this.doRefresh} hideLabel={true} />
        )}
      </span>
    );
  }

  actionsToolbar = () => {
    return (
      <Dropdown
        id="actions"
        title="Actions"
        toggle={<DropdownToggle onToggle={toggle => this.setState({ dropdownOpen: toggle })}>Actions</DropdownToggle>}
        onSelect={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
        position={DropdownPosition.right}
        isOpen={this.state.dropdownOpen}
        dropdownItems={[<DropdownItem>Rollback</DropdownItem>, <DropdownItem>Rollforward</DropdownItem>]}
      />
    );
  };

  toolbar = () => {
    return (
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarSection aria-label="ToolbarSection">
          <Toolbar className={rightToolbar}>
            <RefreshButtonContainer key={'Refresh'} handleRefresh={() => this.fetchExperiment()} />
            {this.actionsToolbar()}
          </Toolbar>
        </ToolbarSection>
      </Toolbar>
    );
  };
  render() {
    const overviewTab = (
      <Tab eventKey={0} title="Overview" key="Overview">
        <ExperimentInfoDescription
          experimentDetails={this.state.expDetailsInfo}
          app={this.state.app}
          miniGraphDataSource={this.graphDataSource}
        />
      </Tab>
    );
    const criteriaTab = (
      <Tab eventKey={1} title="Criteria" key="Criteria">
        <CriteriaInfoDescription criterias={this.state.expDetailsInfo.criterias} />
      </Tab>
    );

    // Default tabs
    const tabsArray: any[] = [overviewTab, criteriaTab];
    const title = this.props.match.params.name;
    return (
      <>
        {this.pageTitle(title)}
        <RenderContent>
          <div>
            {this.toolbar()}

            <ParameterizedTabs
              id="basic-tabs"
              onSelect={tabValue => {
                this.setState({ currentTab: tabValue });
              }}
              tabMap={tabIndex}
              tabName={tabName}
              defaultTab={defaultTab}
              postHandler={this.fetchExperiment}
              activeTab={this.state.currentTab}
              mountOnEnter={false}
              unmountOnExit={true}
            >
              {tabsArray}
            </ParameterizedTabs>
          </div>
        </RenderContent>
      </>
    );
  }

  fetchApp = () => {
    API.getApp(
      this.state.expDetailsInfo.experimentItem.targetServiceNamespace,
      this.state.expDetailsInfo.experimentItem.targetService
    )
      .then(details => {
        this.setState({ app: details.data });
      })
      .catch(error => {
        AlertUtils.addError('Could not fetch App Details.', error);
      });
  };

  private loadMiniGraphData = (namespace, name, experiment) => {
    this.graphDataSource.fetchGraphData({
      namespaces: [{ name: namespace }],
      duration: 600,
      graphType: GraphType.WORKLOAD,
      injectServiceNodes: true,
      edgeLabelMode: EdgeLabelMode.REQUESTS_PER_SECOND,
      showSecurity: false,
      showUnusedNodes: false,
      node: {
        app: experiment,
        namespace: { name: namespace },
        nodeType: NodeType.EXPERIMENT,
        service: name,
        version: '',
        workload: ''
      }
    });
  };
}

export default ExperimentDetailsPage;
