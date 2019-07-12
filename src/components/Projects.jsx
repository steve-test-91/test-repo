import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

import * as api from '../api';
import * as util from '../util';

class Projects extends React.Component {
  state = { projects: [] };
  async componentDidMount() {
    await this.loadSentryPorjects();
  }

  async loadSentryPorjects() {
    const projects = await api.getSentryProjects();
    this.setState({ projects });
  }

  goToProject(projectSlug) {
    util.relativeRedirect(`/projects/${projectSlug}`);
  }

  renderProject(project) {
    return (
      <ProjectHolder key={project.slug}>
        <Button onClick={() => this.goToProject(project.slug)} variant='outline-info'>{project.slug}</Button>
      </ProjectHolder>
    );
  }

  render() {
    return (
      <Container>
        <Header>Projects</Header>
        <ProjectsContainer>
          {this.state.projects.map(project => this.renderProject(project))}
        </ProjectsContainer>
      </Container>
    );
  }
}

export default Projects;

const Container = styled.div``;

const ProjectsContainer = styled.div`

`;

const ProjectHolder = styled.div`
  & .btn {
    width: 350px;
    margin-top: 5px;
    border-radius: .5rem;
  }
`;

const Header = styled.h2`
  margin: 20px;
  text-align: center;
`;
