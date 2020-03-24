import React from 'react';
import { Alignment, Button, Navbar } from '@blueprintjs/core';

function Header() {
  return (
    <header>
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>COVID-19 Trends</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <a href="https://github.com/bmaupin/covid19-trends">
            {/* TODO: Use Github icon? */}
            <Button className="bp3-minimal" icon="git-repo" />
          </a>
        </Navbar.Group>
      </Navbar>
    </header>
  );
}

export default Header;
