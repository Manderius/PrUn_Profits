import React, { useEffect } from 'react';
import './components/production/RecipeTable.jsx';
import './App.css';
import RecipeTable from './components/production/RecipeTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Tabs from 'react-bootstrap/esm/Tabs';
import Tab from 'react-bootstrap/esm/Tab';
import ShoppingListContainer from 'components/shopping/ShoppingListContainer.jsx';
import { loadExchangeData, loadLocalData } from 'data/DataLoader.js';


function App() {
  loadExchangeData();
  loadLocalData();

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Tabs defaultActiveKey="production" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="production" title="Production">
                <RecipeTable />
              </Tab>
              <Tab eventKey="shopping" title="Shopping list">
                <ShoppingListContainer />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
