import React, {useEffect, useState} from 'react';
import {Alert, Container, ListGroup, Nav, Row, Spinner} from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import CalendarHeatmap from 'reactjs-calendar-heatmap';

import { FiBarChart2, FiList } from 'react-icons/fi';

import { api, key, format } from '../../services/api';
import Event from "./Event";

/* Just an example on how to use style object */
const styles = {mouse: {cursor: 'pointer'}}

export default function Events() {
    const [startDate, setStartDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartdata] = useState([]);
    const [showList, setShowList] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);

        api.get(`agenda/${formatDate(startDate)}`, {
            params: { key: key, format: format } }
        ).then((response) => {
            setEvents(response.data.options);
            hadleChartData(response.data.options);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            setHasError(true);
            console.log(error)
        })
    },[startDate])

    const formatDate = (date) => {
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
        const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(date)
        return `${ye}-${mo}-${da}`;
    }

    const hadleChartData = (chartData) => {
        if (!chartData.length) {
            return [];
        }
        /*  As i only can select the exact day, all
        events will have the same date. the api
        didn`t provide the entire month events
        */
        let data = [];
        let chartItem = {
            date : formatDate(new Date(chartData[0].date)),
            total : chartData.length,
            details : []
        };
        chartData.forEach(item => {
            let chartDetail = {
                'name': item.exposition.name,
                'date': item.period.startDate,
                'value': item.period.maximum * 100 // consider this value as a flag to highlight the green square.
            }
            chartItem.details.push(chartDetail);
        })

        data.push(chartItem);
        setChartdata(data);
    }

    const changeView = () => setShowList(!showList);

    return (
        <Container className='mt-3'>
            <Nav className='justify-content-left'>
                {/*If Router is needed*/}
                {/*<Nav.Item> <Nav.Link to="/">Events</Nav.Link></Nav.Item>*/}
            </Nav>

            <Row className='justify-content-between px-3 mb-3'>
                <span>UPCOMING EVENTS</span>
                { !showList && events.length && <FiBarChart2 style={styles.mouse} onClick={ changeView } /> }
                { showList && events.length && <FiList style={styles.mouse} onClick={ changeView }/> }
                <DateTimePicker onChange={(date) => setStartDate(date)} value={startDate} format={'y-MM-dd'}/>
            </Row>

            <section>
                {
                    isLoading &&
                    <Row className='justify-content-center'>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                }

                {
                    !isLoading && showList && !hasError &&
                    <ListGroup > {events.map(event => ( <Event key={event.id} list={event} /> ) )} </ListGroup>
                }
            </section>

            {
                events.length && !showList && !isLoading &&
                <section>
                    <CalendarHeatmap
                        data={chartData}
                        color='#45ff00'
                        overview='year'
                        handler='none'>
                    </CalendarHeatmap>
                </section>
            }

            {
                !events.length > 0 && !isLoading &&
                <section>
                    <Alert variant={'warning'}> No future events were found !</Alert>
                </section>
            }

            {
                hasError && !isLoading &&
                <section>
                    <Alert variant={'danger'}> Something went wrong with the date you chose ! Please select another date</Alert>
                </section>
            }
        </Container>
    )
}


