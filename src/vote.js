var PATH_POLL_EVENT = "/fake_event.json?";
var PATH_VOTE_LINK  = "/vote.html#";

const Button = ReactBootstrap.Button;
const Input = ReactBootstrap.Input;
const Table = ReactBootstrap.Table;
const Label = ReactBootstrap.Label;
const ProgressBar = ReactBootstrap.ProgressBar;
const Badge = ReactBootstrap.Badge;

// data from previous form
var data = window["DATA"] = {};
data.loading = true;
data.eventName = "Event Name";
data.time = "Event Time";
data.deadline = "Event Deadline";
data.voteChoice = null;
data.dests = [];
data.maxVotes = 0;

var form = window["FORM"] = {};


function getVoteLink () {
	return document.location.origin + PATH_VOTE_LINK + data.eventId;
}



var hash = document.location.hash.match(/\#(\d+)/);
if (!hash)
	document.location.href = "/";
else
	data.eventId = parseInt(hash[1]);




/*
			<tr><td>
				<h3>{"Destinations:"}</h3>
			</td></tr>
*/
var Destinations = React.createClass({
	render : function () {
		return (
		<Table>
			<tbody>
				{data.dests.map(function (dest) {
					return (<VoteRow key={dest.id} dest={dest} />);
				})}
			</tbody>
		</Table>)
	}
});
var VoteRow = React.createClass({
	render : function () {
		var dest = this.props.dest;
		var ratio = dest.nvotes / (data.maxVotes + 1);
		var style = (dest == data.voteChoice) ? "info" : "primary";

		return (
			<tr onClick={this.handleClick}>
				<td>
					<strong>{dest.name} <Badge bsSize="large">{dest.nvotes}</Badge></strong>
					<ProgressBar striped bsStyle={style} now={ratio * 100} />
				</td>
			</tr>);
	},
	handleClick : function () {
		if (data.voteChoice)
			data.voteChoice.nvotes--;
		else
			data.maxVotes++;

		data.voteChoice = this.props.dest;
		this.props.dest.nvotes++;
		form.dests.forceUpdate();
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

		return (<div><i>Voting ends {left}</i></div>);
	},
	componentDidMount : function () {
		var s = this;
		setInterval(function () { s.forceUpdate(); }, 1000);
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
				<div className="text-center">
					<h3><Label bsStyle="success">{data.eventName}</Label></h3>
				</div>
				{"Time: "}
				<strong>{moment(data.time).format("h:mm A")}</strong>
				<ShareLink />
				<CountDown ref={function (self) { form.countDown = self; }} />
				<Destinations ref={function (self) { form.dests = self; }} />
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
			data.dests.forEach(function (dest) {
				dest.nvotes = ~~(Math.random() * 10);
				data.maxVotes = Math.max(data.maxVotes, dest.nvotes);
			});
			form.everything.forceUpdate();
		});
	}}/>,
	document.getElementById("everything"));
