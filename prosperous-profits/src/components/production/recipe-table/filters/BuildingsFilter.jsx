import React, { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function getBuildingsByTiers(buildings, tiers) {
    return buildings.filter(bld => tiers.includes(bld.Tier)).map(bld => bld.Ticker);
}

function TierRow({ buildings, setAllowed }) {
    const tiers = Array.from(Array(5).keys()).map(key => key + 1);
    const update = (data) => {
        const checked = tiers.filter(tier => data.target.form[`chb-Tier${tier}`].checked);
        setAllowed(getBuildingsByTiers(buildings, checked));
    };

    return (
        <>
            <h3>Tiers</h3>
            <Form>
                <Row>
                    {tiers.map(key => <Col key={key} md='auto'><Form.Check
                        className='checkbox-large'
                        type='checkbox'
                        name={`chb-Tier${key}`}
                        label={`Tier ${key}`}
                        defaultChecked={key <= 2}
                        onChange={update}
                    />
                    </Col>
                    )}
                </Row>
            </Form>
        </>
    );
}

export default function BuildingsFilter({ setAllowedBuildings }) {
    useEffect(() => {
        setAllowedBuildings(owned);

    }, []);
    const buildingsData = useSelector(state => state.data.buildings);
    const owned = useSelector(state => state.preferences.buildings);
    const setOwnedOnly = () => {
        setAllowedBuildings(owned);
    }
    return (
        <Container className='mt-2'>
            <Container className='border p-3'>
                <TierRow buildings={buildingsData} setAllowed={setAllowedBuildings} />
                <Button variant="primary" className="mt-2" onClick={setOwnedOnly}>Show my buildings only</Button>
            </Container>
        </Container>
    );
}
