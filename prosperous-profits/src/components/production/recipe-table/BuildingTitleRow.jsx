import React, { Component } from 'react'
import './RecipeRow.css';
import { Badge, Col, Container, Row } from 'react-bootstrap';

export class RecipeRow extends Component {
    constructor(props) {
        super(props);
        const { Title, Tier } = props.data;
        this.state = {
            Title: Title,
            Tier: Tier
        }
    }

    secondsToTimeString(seconds) {
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return `${hours}h ${minutes}m`;
    }

    render() {
        return (
            <tr>
                <td colSpan={6}>
                    <Container className='p-0'>
                        <Row>
                            <Col>
                                <strong>{this.state.Title}</strong> <Badge bg="secondary">{this.state.Tier}</Badge>
                            </Col>
                        </Row>
                    </Container>
                </td>
            </tr>
        )
    }
}

export default RecipeRow;
