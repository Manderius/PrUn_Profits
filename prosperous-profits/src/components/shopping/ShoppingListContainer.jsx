import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import ShoppingList from './shopping-list/ShoppingList';

function ShoppingListContainer() {
  return (
    <Row>
      <Col>
        <ShoppingList />
      </Col>
      <Col>
        <h1>Sell</h1>
      </Col>
    </Row>
  );

}

export default ShoppingListContainer;
