import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, CardBody } from "reactstrap";
import NavMenu from "../Layout/NavMenu";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faClock, faRulerHorizontal, faPercentage } from "@fortawesome/free-solid-svg-icons";
import Chart from 'react-apexcharts';
import Loading from "../Pages/Loading";
import "./style.css";

const StatsOverall = () => {
    const [flightsNo, setFlightsNo] = useState();
    const [time, setTime] = useState();
    const [km, setKm] = useState();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/Statistics`)
            .then((response) => {
                setFlightsNo(response.data.flightsNo);
                setTime(response.data.timeInSeconds);
                setKm(response.data.kilometers);
            });
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/User/kilometers`)
            .then((response) => {
                setUsers(response.data);
                setLoading(false)
            })
    }, []);

    function renderPie()
    {
        const data = users.map((item) => {
            return (item.fullName);
        });

        const series = users.map((item) => {
            return (Math.round(item.sumKilometers));
        });
        const options = {
            labels: data,
        }
        return (
            <div className="d-flex justify-content-center">
                <Chart options={options} series={series} type="pie" className="pie"/>
            </div>
        );
    }

    function renderPieFlights()
    {
        const data = users.map((item) => {
            return (item.fullName);
        });

        const series = users.map((item) => {
            return (item.flightsNo);
        });
        const options = {
            labels: data,
        }
        
        return (
            <div className="d-flex justify-content-center">
                <Chart options={options} series={series} type="pie" className="pie" />
            </div>
        );
    }

    function renderPieHours()
    {
        const data = users.map((item) => {
            return (item.fullName);
        });

        const series = users.map((item) => {
            return (item.timeInSec);
        });
        const options = {
            labels: data,
        }
        
        return (
            <div className="d-flex justify-content-center">
                <Chart options={options} series={series} type="pie" className="pie" />
            </div>
        );
    }

    function renderTime(dataCalc) {
        var d = Number(dataCalc);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
    
        var hDisplay = h > 0 ? h + ":" : "";
        var mDisplay = m > 9 ? m : "0" + m;
        return hDisplay + mDisplay; 
    }
    if (loading) {
        return (
          <>
            <Loading />
          </>
        );
    }
    else if(users)
    {
        return(
            <>
                <NavMenu />
                <Container>
                    <Row>
                        <Col lg="4">
                            <Card className="card-box bg-dark border-0 text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Počet letů</small>
                                            <span className="font-size-xxl mt-1">{flightsNo}</span>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faPlaneDeparture} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card className="card-box bg-dark border-0 text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Počet hodin</small>
                                            <span className="font-size-xxl mt-1">{renderTime(time)}</span>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faClock} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card className="card-box bg-dark border-0 text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Počet kilometrů</small>
                                            <span className="font-size-xxl mt-1">{Math.round(km)} KM</span>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faRulerHorizontal} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Card className="card-box border-0 bg-dark text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Nálet pilotů (podle kilometrů)</small>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faPercentage} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                    {renderPie()}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-box border-0 bg-dark text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Nálet pilotů (podle hodin)</small>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faPercentage} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                    {renderPieHours()}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-box border-0 bg-dark text-light mb-5">
                                <CardBody>
                                    <div className="d-flex align-items-start">
                                        <div className="font-weight-bold">
                                            <small className="text-white-70 d-block mb-1 text-uppercase">Nálet pilotů (podle letů)</small>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faPercentage} className="font-size-xl" />
                                            </div>
                                        </div>
                                    </div>
                                    {renderPieFlights()}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default StatsOverall;