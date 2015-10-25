var PATH_POLL_EVENT = "/fake_event.json?";
var PATH_VOTE_LINK  = "/vote.html#";

var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var Label = ReactBootstrap.Label;

// data from previous form
var data = window["DATA"] = {};
data.loading = true;
data.eventName = "Event Name";
data.time = "Event Time";
data.deadline = "Event Deadline";
data.allSelected = [];

var form = window["FORM"] = {};



function getVoteLink () {
	return document.location.origin + PATH_VOTE_LINK + data.eventId;
}



var hash = document.location.hash.match(/\#(\d+)/);
if (!hash)
	document.location.href = "/";
else
	data.eventId = parseInt(hash[1]);


var ShowDate = React.createClass({
	render : function () {
		var val = data[this.props.field];
		val = val.toTimeString().slice(0, 5);
		return (<div>
				{this.props.label}  <strong>{val}</strong>
			</div>);
	}
});
/*
			<tr><td>
				<h3>{"Destinations:"}</h3>
			</td></tr>
*/
var Destinations = React.createClass({
	render : function () {
		return (
		<Table><tbody>
			{data.dests.map(function (place) {
				return (<tr key={place.id}><td>
						<h3>{place.name}</h3>
					</td></tr>);
			})}
		</tbody></Table>)
	}
});
var ShareLink = React.createClass({
	render : function () {
		return (<div>
			{"Share link:"}
			<Input type="text" defaultValue={document.location.href}
				bsSize="small" />
			</div>);
	}
});


var Everything = React.createClass({
	render : function () {
		if (data.loading)
			return (
				<div className="container">
					<i>Loading...</i>
				</div>);

		return (
			<div className="container">
				<h3><Label bsStyle="info">{data.eventName}</Label></h3>
				<ShowDate label="Time:" field="time" />
				<ShareLink />
				<Destinations />
			</div>);
	}
});


ReactDOM.render(
	<Everything ref={function (self) {
		form.everything = self;

		var ajax = $.ajax({
			url : PATH_POLL_EVENT + data.eventId,
			dataType : "json"
		}).done(function (res, status) {
			data.loading = false;
			// grab data
			data.eventName = res.event.name;
			data.time = new Date(res.event.time);
			data.deadline = new Date(res.event.deadline);
			data.dests = res.event.destinations;
			form.everything.forceUpdate();
		});
	}}/>,
	document.getElementById("everything"));
