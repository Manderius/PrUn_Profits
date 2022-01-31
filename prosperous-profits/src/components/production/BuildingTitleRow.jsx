import React, { Component } from 'react'
import './RecipeRow.css';
import { Col, Container, Row } from 'react-bootstrap';

export class RecipeRow extends Component {
    constructor(props) {
        super(props);
        const { Title } = props.data;
        this.state = {
            Title: Title
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
                                <strong>{this.state.Title}</strong>
                            </Col>
                        </Row>
                    </Container>
                </td>
            </tr>
        )
    }
}

export default RecipeRow;
