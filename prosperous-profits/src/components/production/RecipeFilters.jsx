import React, { Component } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import './RecipeFilters.css';

export default class RecipeFilters extends Component {
    onBuildingText;
    onWithBuyersChb;
    onInputAvailable;

    constructor(props) {
        super(props);
        this.onBuildingText = props.building;
        this.onWithBuyersChb = props.withBuyers;
        this.onInputAvailable = props.purchaseable;
    }

    onBuildingTextChanged(event) {
        this.onBuildingText(event.target.value);
    }

    onBuyersCheckboxChanged(event) {
        this.onWithBuyersChb(event.target.checked);
    }

    onInputAvailableCheckboxChanged(event) {
        this.onInputAvailable(event.target.checked);
    }

    render() {
        return (
            <Container className='mt-2 mb-2 p-0'>
                <Row>
                    <Col md='auto'>
                        <Form.Control placeholder="Search for building..." onChange={this.onBuildingTextChanged.bind(this)} />
                    </Col>
                    <Col md='auto'>
                        <Form.Check
                            className='checkbox-large'
                            type='checkbox'
                            id={`chb-WithBuyersOnly`}
                            label={`Only with buyers`}
                            onChange={this.onBuyersCheckboxChanged.bind(this)}
                            defaultChecked={true}
                        />
                    </Col>
                    <Col md='auto'>
                        <Form.Check
                            className='checkbox-large'
                            type='checkbox'
                            id={`chb-OnlyPurchaseable`}
                            label={`Input available`}
                            onChange={this.onInputAvailableCheckboxChanged.bind(this)}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
