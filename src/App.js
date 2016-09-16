var React = require('react')
var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location
var NotFound = Router.NotFound

var Doc = require('./components/Doc')
var Feed = require('./components/Feed')
var Home = require('./components/Home')
var Page404 = require('./components/Page404')


module.exports = React.createClass({
  render: function () {
    return (
			<div>
				<ul>
					<li>
						<a href="/">home</a>
					</li>
					<li>
						<a href="/doc">doc</a>
					</li>
					<li>
						<a href="/feed">feed</a>
					</li>
				</ul>
				<Locations>
					<Location path="/" handler={Home} />
					<Location path="/feed" handler={Feed} />
					<Location path="/doc" handler={Doc} />
					<NotFound handler={Page404} />
				</Locations>
			</div>
    )
  }
})