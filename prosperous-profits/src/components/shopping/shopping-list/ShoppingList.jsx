import React, { Component } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingListAction, ShoppingType } from './ShoppingListEnums';
import ShoppingListRow from './ShoppingListRow';


function getBuyItemAction(ticker, amount, orderType) {
    return { type: ShoppingListAction.ADD_ITEM, payload: { ticker, amount, orderType } }
}

function getRemoveItemAction(id, orderType) {
    return { type: ShoppingListAction.REMOVE_ITEM, payload: { id, orderType } }
}

function ShoppingList({ selector, orderType, title }) {
    const items = useSelector(selector);
    const dispatch = useDispatch();

    const addItem = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const ticker = event.target.ticker.value;
        const amount = event.target.amount.value;
        if (ticker.length == 0 || amount < 1) return;
        dispatch(getBuyItemAction(ticker, amount, orderType));
    }

    const removeItem = (id) => {
        dispatch(getRemoveItemAction(id, orderType));
    }

    return (
        <>
            <h2>{title}</h2>
            <Form onSubmit={addItem}>
                <Row className='mb-3'>
                    <Col md='2'>
                        <Form.Control placeholder="Ticker" name="ticker" />
                    </Col>
                    <Col md='2'>
                        <Form.Control placeholder="Amt" type="number" name="amount" />
                    </Col>
                    <Col md='auto'>
                        <Button type="submit">Add</Button>
                    </Col>

                </Row>
            </Form>
            <Row>
                <Col>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Amount</th>
                                <th>Price / unit</th>
                                <th>Total price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map(item => <ShoppingListRow key={item.id} ticker={item.ticker} amount={item.amount} price={10} doRemoveItem={() => removeItem(item.id)} />)
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>

    );
}

export default ShoppingList;
