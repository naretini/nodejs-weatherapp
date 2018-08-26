let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Cities', () => {
    
    describe('/GET Cities ? lat lng', () => {
        it('it should GET all cities around 10km', (done) => {
            chai.request(server)
                .get('/cities?lat=45.6478645&lng=9.3522898')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(56);
                    done();
                });
        });


        it('it should GET no cities', (done) => {
            chai.request(server)
                .get('/cities?lat=&lng=9.3522898')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql("BadRequestError");
                    done();
                });
        });
    });


    describe('GET /cities/{city_id}', () => {
        it('it should GET city info', (done) => {
            chai.request(server)
                .get('/cities/6540584')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.id.should.be.eql(6540584);
                    res.body.name.should.be.eql("Lissone");
                    res.body.lng.should.be.eql( 9.24655);
                    res.body.lat.should.be.eql(45.615582);
                    done();
                });
        });

        it('it should GET no cities', (done) => {
            chai.request(server)
                .get('/cities/89793522898')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql("NotFoundError");
                    done();
                });
        });
    });

    
    describe('GET /cities/6540584/weather', () => {
        it('it should GET city weather info', (done) => {
            chai.request(server)
                .get('/cities/6540584/weather')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('temp');
                    res.body.should.have.property("type");
                    res.body.should.have.property("type_description");
                    res.body.should.have.property("sunrise");
                    res.body.should.have.property("sunset");
                    res.body.should.have.property("temp");
                    res.body.should.have.property("temp_min");
                    res.body.should.have.property("temp_max");
                    res.body.should.have.property("pressure");
                    res.body.should.have.property("humidity");
                    res.body.should.have.property("clouds_percent");
                    res.body.should.have.property("wind_speed");           
                    done();
                });
        });

        it('it should GET no cities', (done) => {
            chai.request(server)
                .get('/cities/89793522898/weather')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql("NotFoundError");
                    done();
                });
        });
    });

});