import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function ShoppingListTotalRow({ total }) {
    return (
        <tr>
            <td colSpan={5}>
                <Container className='p-0'>
                    <Row>
                        <Col>
                            <strong>Total:</strong>
                        </Col>
                        <Col className="text-end">
                            <strong>{total.toFixed(0)}</strong>
                        </Col>
                    </Row>
                </Container>
            </td>
        </tr>
    );
}
