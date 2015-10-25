var PATH_POLL_EVENT = "/fake_event.json?";
var PATH_VOTE       = "/fake_vote.json";

const INTERVAL_PERIODIC_POLL = 5000;
const INTERVAL_BACKUP = 10000; // if the ajax request fails

const Button = ReactBootstrap.Button;
const Input = ReactBootstrap.Input;
const ListGroup = ReactBootstrap.ListGroup;
const Label = ReactBootstrap.Label;
const ProgressBar = ReactBootstrap.ProgressBar;
const Badge = ReactBootstrap.Badge;

// data from ajax
var data = window["DATA"] = {};
data.eventName = "Event Name";
data.time = "Event Time";
data.deadline = "Event Deadline";
data.voteChoice = null;
data.dests = [];
data.maxVotes = 0;

// form objects
var form = window["FORM"] = {};
form.isLoading = true;


// utilities
function destById (id) {
	for (var i = 0; i < data.dests.length; i++)
		if (data.dests[i].id === id)
			return data.dests[i];
	return null;
}
function updateVotes () {
	data.maxVotes = 0;
	data.dests.forEach(function (dest) {
		data.maxVotes = Math.max(data.maxVotes, dest.voteCount);
	});
}

// find the event id from the URL, or go back
// TODO: read from cookies or localStorage
var hash = document.location.hash.match(/\#(\d+)/);
if (!hash)
	document.location.href = "/";
else
	data.eventId = parseInt(hash[1]);



// destination list
var Destinations = React.createClass({
	render : function () {
		return (
		<ListGroup>
			{data.dests.map(function (dest) {
				return (<VoteRow key={dest.id} dest={dest} />);
			})}
		</ListGroup>)
	}
});
var VoteRow = React.createClass({
	render : function () {
		// appearance
		var dest = this.props.dest;
		var ratio = dest.voteCount / (data.maxVotes + 1);
		var style = (dest == data.voteChoice) ? "info" : "primary";
		var label = dest.voteCount + ((dest.voteCount === 1) ? " vote" : " votes");
		if (dest.voteCount === 0) label = "None";

		return (
			<ReactBootstrap.ListGroupItem onClick={this.handleClick}>
				<strong>{dest.name}</strong>
				<ProgressBar striped bsStyle={style} now={ratio * 88 + 12} label={label}/>
			</ReactBootstrap.ListGroupItem>);
	},
	handleClick : function () {
		if (data.voteChoice)
			return;

		// perform a vote
		data.voteChoice = this.props.dest;
		$.ajax({
			url : PATH_VOTE,
			method : "POST"
		}).done(function (res, status, ajax) {
			pollVotes();
		});
	}
})
var ShareLink = React.createClass({
	render : function () {
		return (<div>
			{"Share link:"}
			<Input type="text" defaultValue={document.location.href}
				bsSize="small" />
			</div>);
	}
});
var CountDown = React.createClass({
	render : function () {
		var left = moment().to(data.deadline);

		// TODO: redirect when the voting is over
		return (<div><i>Voting ends {left}</i></div>);
	},
	componentDidMount : function () {
		var s = this;

		// TODO: end this loop ever? or nah
		setInterval(function () { s.forceUpdate(); }, 1000);
	}
});


var Everything = React.createClass({
	render : function () {
		if (form.isLoading)
			return (
				<div className="container">
					<i>Loading...</i>
				</div>);

		return (
			<div className="container">
				<div className="text-center">
					<h3><Label bsStyle="success">{data.eventName}</Label></h3>
				</div>
				{"Time: "}
				<strong>{moment(data.time).format("h:mm A")}</strong>
				<ShareLink />
				<CountDown ref={function (self) { form.countDown = self; }} />
				<Destinations ref={function (self) { form.dests = self; }} />
			</div>);
	},
	componentDidMount : function () {
		form.everything = this;

		// on init, immediately poll the server
		var ajax = $.ajax({
			url : PATH_POLL_EVENT + data.eventId,
			dataType : "json"
		}).done(function (res, status) {
			form.isLoading = false;
			// grab event data (destination descriptions)
			data.eventName = res.event.name;
			data.time = new Date(res.event.time);
			data.deadline = new Date(res.event.deadline);
			data.dests = res.event.destinations;
			data.dests.forEach(function (dest) { dest.voteCount = 0; });
			document.location.hash = "#" + res.event.id;
			form.everything.forceUpdate();

			pollVotes();
		});
	}
});


var backupTimer = -1;
function pollVotes () {
	// poll for event data
	$.ajax({
		url : PATH_POLL_EVENT + data.eventId,
		dataType : "json"
	}).done(function (res, status, ajax) {
		// update to match
		res.event.destinations.forEach(function (k) {
			var dest = destById(k.id);
			if (dest)
				dest.voteCount = Math.max(dest.voteCount, k.vote_count);
		});
		updateVotes();
		form.dests.forceUpdate();

		clearInterval(backupTimer);
		setTimeout(pollVotes, INTERVAL_PERIODIC_POLL);
	});

	// fall back to this if nothing received
	clearInterval(backupTimer);
	backupTimer = setTimeout(pollVotes, INTERVAL_BACKUP);
}

ReactDOM.render(
	<Everything />,
	document.getElementById("everything"));
