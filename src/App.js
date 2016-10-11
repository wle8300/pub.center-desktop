var JwtDecode = require('jwt-decode')
var Request = require('superagent')
var React = require('react')

var Main = require('./components/Main')
var Nav = require('./components/Nav')
var Footer = require('./components/Footer')

var backend = require('../config').backend


module.exports = React.createClass({
	getInitialState: function () {
		return {
			jwt: null,
			user: null
		}
	},
  render: function () {
    return (
			<div className="App" style={styleA()}>
				<Nav
					onJwt={this.onJwt}
					jwt={this.state.jwt}
					onUser={this.onUser}
					user={this.state.user}/>
				<Main
					jwt={this.state.jwt}
					user={this.state.user}
					onJwt={this.onJwt}
					onUser={this.onUser}/>
				<Footer/>
			</div>
    )
  },
	componentDidMount: function () {

		this.establishSession()
	},
	componentDidUpdate: function (prevProps, prevState) {
		
		//fresh jwt
		if (this.state.jwt && prevState.jwt !== this.state.jwt) {

			this.readUser()
		}
	},
	establishSession: function () {
		
		var expirationMs
		var expirationDate
		
		if (!JSON.parse(localStorage.jwt)) return
	
		expirationMs = JwtDecode(JSON.parse(localStorage.jwt)).exp * 1000
		expirationDate = new Date(expirationMs)
		
		//exp passed?
		if (expirationDate < new Date()) {

			localStorage.removeItem('jwt')
			
			return this.onJwt(null)
		}
		
		//jwt is fresh. auto-renew it!
		else {
			
			Request
			.put(backend+ '/jwt')
			.send({jwt: JSON.parse(localStorage.jwt)})
			.end((err, response) => {

				if (err) throw err

				if (!response.text) return this.onJwt(null)

				return this.onJwt(response.text)
			})
		}
	},
	readUser: function () {

		Request
		.get(backend+ '/user/' +JwtDecode(this.state.jwt).id)
		.set({Authorization: 'Bearer ' +this.state.jwt})
		.end((err, response) => {
	
			if (err) throw err

			this.onUser(response.body)
			return
		})
	},
	onJwt: function (jwt, callback) {

		localStorage.jwt = JSON.stringify(jwt)
		
		this.setState({jwt: jwt}, callback)
	},
	onUser: function (user, callback) {
		
		this.setState({user: user}, callback)
	}
})

function styleA() {
	return {
		margin: '0 auto',
		width: '50%',
		fontFamily: 'Helvetica'
	}
}