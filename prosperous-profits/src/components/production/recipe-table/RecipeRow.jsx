import React, { Component } from 'react'
import './RecipeRow.css';
import { Col, Container, Row } from 'react-bootstrap';
import MaterialSquare from 'components/material-square/MaterialSquare';


export class RecipeRow extends Component {
    _key;

    constructor(props) {
        super(props);
        const { Inputs, Outputs, Time, Profit, MaxProfit, Message } = props.data;
        this._key = props.data.Key;
        this.state = {
            Inputs: Inputs,
            Outputs: Outputs,
            Time: Time,
            Ratio: Profit,
            AskRatio: MaxProfit,
            Message: Message
        }
    }

    secondsToTimeString(seconds) {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return `${hours}h ${minutes}m`
    }

    getClassForRatio(ratio) {
        if (ratio < 0.4) return '';
        if (ratio < 0.7) return 'color-green-100';
        if (ratio < 1) return 'color-green-200';
        if (ratio < 1.3) return 'color-green-300';
        return 'color-green-400';
    }

    render() {
        return (
            <tr>
                <td>
                    <Container>
                        <Row>
                            {this.state.Inputs.map((input, i) => <Col md='auto' key={1000 * this._key + i}><MaterialSquare data={input} /></Col>)}
                        </Row>
                    </Container>
                </td>
                <td className=''>
                    <Container>
                        <Row>
                            {this.state.Outputs.map((input, i) => <Col md='auto' key={1000 * this._key + 50 + i}><MaterialSquare data={input} /></Col>)}
                        </Row>
                    </Container>
                </td>
                <td>
                    <Container>
                        <Row>
                            {this.secondsToTimeString(this.state.Time)}
                        </Row>
                    </Container>
                </td>
                <td className={this.getClassForRatio(this.state.Ratio)}>
                    <Container>
                        <Row>
                            <Col>{this.state.Ratio.toFixed(3)}</Col>
                        </Row>
                    </Container>
                </td>
                <td className={this.getClassForRatio(this.state.AskRatio)}>
                    <Container>
                        <Row>
                            <Col>{this.state.AskRatio.toFixed(3)}</Col>
                        </Row>
                    </Container>
                </td>
                <td>
                    <Container>
                        <Row>
                            <Col>{this.state.Message}</Col>
                        </Row>
                    </Container>
                </td>
            </tr>
        )
    }
}

export default RecipeRow;
