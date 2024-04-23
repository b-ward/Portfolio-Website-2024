import React, {Component} from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './card.css';

class SharedCard extends Component {
    render() {
        return(
            <div className="col-sm-12 col-lg-12">
                <Card style={{margin: '0 0 2rem 0'}}>
                    <Row className='no-gutters'>
                        {this.props.imageSrc &&
                            <Col xs="auto">
                                <Card.Img style={{maxHeight: '100px', width: 'auto', float: 'left'}} variant="top" src={this.props.imageSrc} />
                            </Col>
                        }
                        <Col>
                            <Card.Body>
                                <Card.Title>{this.props.cardTitle}</Card.Title>
                                <Card.Text>
                                {this.props.cardBody}
                                </Card.Text>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
        </div>
        )
    }
}

export default SharedCard;