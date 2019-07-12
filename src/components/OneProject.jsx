import React from 'react';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';

import orderBy from 'lodash/orderBy';

import * as api from '../api';
import * as util from '../util';


class Projects extends React.Component {
  state = {};
  async componentDidMount() {
    await Promise.all([this.loadIssues(), this.loadProjectInfo()]);
  }

  async loadIssues() {
    Sentry.captureException(new Error('mang'))
    let issues = await api.getSentryIssues(this.projectSlug);
    issues = orderBy(
      issues,
      [issue => parseInt(issue.count), 'title'],
      ['desc', 'asc']
    );
    this.setState({ issues });
  }

  async loadProjectInfo() {
    const projectInfo = await api.getSentryProjectInfo(this.projectSlug);
    this.setState({ projectInfo });
  }

  get projectSlug() {
    return this.props.match.params.projectSlug;
  }

  isLoaded() {
    const { projectInfo, issues } = this.state;
    return projectInfo && !!issues;
  }

  renderOneIssue(issue) {
    const { projectInfo } = this.state;
    const orgSlug = projectInfo.organization.slug;
    const projectId = projectInfo.id;
    const issueUrl = `https://sentry.io/organizations/${orgSlug}/issues/${
      issue.id
    }/?project=${projectId}`;
    return (
      <IssueHolder key={issue.id}>
        <td>{issue.title}</td>
        <td>
          <a target='_blank' href={issueUrl}>
            {issue.shortId}
          </a>
        </td>
        <td>{issue.count}</td>
        <td>{issue.status}</td>
      </IssueHolder>
    );
  }

  renderCore() {
    return (
      <div>
        <Header>{this.state.projectInfo.name} Issues</Header>
        <ProjectContainer>
          <thead>
            <tr>
              <th>Title</th>
              <th>Issue#</th>
              <th>Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.issues.map(issue => this.renderOneIssue(issue))}
          </tbody>
        </ProjectContainer>
      </div>
    );
  }

  renderLoading() {
    return <Header>Loading...</Header>;
  }

  render() {
    return (
      <Container>
        {this.isLoaded() ? this.renderCore() : this.renderLoading()}
      </Container>
    );
  }
}

export default Projects;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProjectContainer = styled.table`
  & td {
    text-align: left;
    padding: 5px;
    border: 1px solid black;
  }
`;

const IssueHolder = styled.tr``;

const Header = styled.h2`
  margin: 20px;
  text-align: center;
`;
