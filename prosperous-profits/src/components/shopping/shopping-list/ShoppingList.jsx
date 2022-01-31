import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingListAction, ShoppingType } from './ShoppingListEnums';


function getBuyItemAction() {
    return { type: ShoppingListAction.ADD_ITEM, payload: { ticker: 'PE', orderType: ShoppingType.BUYING } }
}

function getRemoveItemAction() {
    return { type: ShoppingListAction.REMOVE_ITEM, payload: { ticker: 'PE' } }
}

function ShoppingList() {
    const last = useSelector(state => state.shopping.items.length);
    const dispatch = useDispatch();

    return (
        <div>
            Last value is now: {last}
            <br />
            <Button onClick={() => dispatch(getBuyItemAction())}>Add product</Button>
            <Button onClick={() => dispatch(getRemoveItemAction())}>Remove product</Button>
        </div>
    );
}

export default ShoppingList;
