import MaterialSquare from 'components/production/MaterialSquare';
import React from 'react';
import { Button, Container } from 'react-bootstrap';

const ShoppingListRow = (data) => {
    const { ticker, price, amount, doRemoveItem } = data;
    return (
        <tr>
            <td><MaterialSquare data={{ Ticker: ticker }} /></td>
            <td><Container>{amount}</Container></td>
            <td><Container>{price}</Container></td>
            <td><Container>Total</Container></td>
            <td style={{ textAlign: "center" }}><Button variant="outline-danger" onClick={doRemoveItem} style={{ width: "2.5em" }}>X</Button></td>
        </tr>
    );
};

export default ShoppingListRow;
