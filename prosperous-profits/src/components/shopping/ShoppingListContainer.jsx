import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import ShoppingList from './shopping-list/ShoppingList';
import { ShoppingType } from './shopping-list/ShoppingListEnums';

function ShoppingListContainer() {
  return (
    <Row>
      <Col>
        <ShoppingList selector={(state) => state.shopping.buying} orderType={ShoppingType.BUYING} title="Buying" />
      </Col>
      <Col>
        <ShoppingList selector={(state) => state.shopping.selling} orderType={ShoppingType.SELLING} title="Selling" />
      </Col>
    </Row>
  );

}

export default ShoppingListContainer;
