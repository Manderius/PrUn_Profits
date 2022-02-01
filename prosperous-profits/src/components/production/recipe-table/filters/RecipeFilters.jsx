import React, { Component } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import BuildingsFilter from './BuildingsFilter';
import './RecipeFilters.css';

export default class RecipeFilters extends Component {
    onBuildingText;
    onWithBuyersChb;
    onInputAvailable;
    onMinProfitChb;
    onMinProfitValue;
    changeDisplayedBuildings;

    constructor(props) {
        super(props);
        const actions = props.actions;
        this.onBuildingText = actions.buildingName;
        this.onWithBuyersChb = actions.withBuyers;
        this.onInputAvailable = actions.purchaseable;
        this.onMinProfitChb = actions.minProfitActive;
        this.onMinProfitValue = actions.minProfitValue;
        this.changeDisplayedBuildings = actions.changeDisplayedBuildings;
        this.state = { buildingMenuVisible: true };
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

    onMinProfitCheckboxChanged(event) {
        this.onMinProfitChb(event.target.checked);
    }

    onMinProfitValueChanged(event) {
        this.onMinProfitValue(event.target.value);
    }

    onToggleBuildingsFilter(event) {
        this.setState({ buildingMenuVisible: !this.state.buildingMenuVisible });
    }

    render() {
        return (
            <Container className='mt-2 mb-2 p-0'>
                <Row>
                    <Col md='auto' className='pe-0'>
                        <Form.Control placeholder="Search for building..." onChange={this.onBuildingTextChanged.bind(this)} />
                    </Col>
                    <Col md='auto' className='ps-0'>
                        <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" onClick={this.onToggleBuildingsFilter.bind(this)} />
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
                            defaultChecked={true}
                        />
                    </Col>
                    <Col md='auto'>
                        <Row>
                            <Col md='auto'>
                                <Form.Check
                                    className='checkbox-large'
                                    type='checkbox'
                                    id={`chb-MinProfit`}
                                    label={`Min. Profit:`}
                                    onChange={this.onMinProfitCheckboxChanged.bind(this)}
                                    defaultChecked={true}
                                />
                            </Col>
                            <Col md='3'>
                                <Form.Control placeholder="Price" type="number" name="amount" min="0" step="0.1" onChange={this.onMinProfitValueChanged.bind(this)} defaultValue="0.5" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    {this.state.buildingMenuVisible ? <BuildingsFilter setAllowedBuildings={this.changeDisplayedBuildings.bind(this)} /> : null}
                </Row>
            </Container>
        );
    }
}
