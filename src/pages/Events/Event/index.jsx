import React, {useEffect, useState} from 'react';
import {Col, ListGroup, Row} from "react-bootstrap";

const Event = props => {
    const [info, setInfo] = useState(props.list);

    useEffect(() => {
        setInfo(props.list);
    },[props]);

    return (
        <ListGroup.Item>
            <Row>
                <Col xs={2}><b>11:00 - 12:00</b></Col>
                <Col xs={4}>
                    <Row><div><b>{info.exposition?.name}</b></div></Row>
                    <Row className='mt-2'>
                        <Col>
                            <Row>Places available:</Row>
                            <Row>Price:</Row>
                            <Row>Language</Row>
                        </Col>
                        <Col>
                            <Row>{info.period.remaining} of {info.period.maximum}</Row>
                            <Row>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR'})
                                .format(info.exposition.price.amount)}</Row>
                            <Row>Dutch</Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default Event;
