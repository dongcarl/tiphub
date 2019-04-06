import React from 'react';
import { Button, Header, Divider, Search, Icon } from 'semantic-ui-react';
import { makeBackendUrl } from '../util/formatters';
import './Home.less';

const Home: React.SFC<{}> = () => (
  <div className="Home">
    <div className="Home-info">
      <h1 className="Home-info-title">
        Show open source some love
      </h1>
      <p className="Home-info-text">
        Set up or conribute to lightning tips for open source projects.
        Non-custodial, direct to the creators.
      </p>
      <Button size="huge">Learn more</Button>
    </div>
    <div className="Home-forms">
      <div className="Home-forms-start">
        <Header as="h2">
          Set up your node now
        </Header>
        <Button
          href={makeBackendUrl("/oauth/github/login")}
          size="big"
          color="black"
          fluid
        >
          <Icon name="github" /> Connect with GitHub
        </Button>
        <Button
          href={makeBackendUrl('/oauth/gitlab/login')}
          size="big"
          color="orange"
          fluid
        >
          <Icon name="gitlab" /> Connect with GitLab
        </Button>
      </div>
      <Divider section horizontal>or</Divider>
      <div className="Home-forms-search">
        <Header as="h2">
          Find someone to tip
        </Header>
        <Search size="large" fluid />
      </div>
    </div>
  </div>
);

export default Home;