// import stuff
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;

// global lookup for form controls (submit button, text input...)
var form = {};
form.ajaxPolling = false;

// global lookup for form data
var data = {};
data.eventName = "";
data.time = "" + new Date();
data.deadline = "" + new Date();
data.allSelected = [];


var allPlaces = [
	Location("Eskimo Candy", "", 0),
	Location("Mama's Fish House", "", 1),
	Location("Kimo's", "", 2),
	Location("Da Kitchen Cafe", "", 3),
	Location("Cafe O'Lei Kihei", "", 4),
	Location("Sansei Seafood & Sushi Bar", "", 5),
	Location("Star Noodle", "", 6),
	Location("Lahaina Grill", "", 7),
	Location("Paia Fish Market", "", 8),
	Location("Monkeypod Kitchen by Merriman", "", 9),
	Location("Mala Ocean Tavern", "", 10),
	Location("Flatbread Company", "", 11)
];
function performSearch (search, cb) {
	function find (pl) {
		return pl.name.toLowerCase().indexOf(search.toLowerCase());
	}

	var r = [];

	if (search) {
		r = [];
		for (var i = 0; i < allPlaces.length; i++) 
			if (find(allPlaces[i]) !== -1)
				r.push(allPlaces[i]);

		r = r.sort(function (a, b) {
			return find(a) - find(b);
		});
	}
	else
		r = allPlaces;

	setTimeout(function () {
		cb(r);
	}, 100);
}


var Everything = React.createClass({
	render : function () {
		return (
			<div className="container">
				<br />
				<SubmitButton ref={function (self) { form.submitButton = self; }}/>
				<InputText kind="text" label="Name" field="eventName" />
				<InputText kind="time" label="Time" field="time" />
				<InputText kind="time" label="Deadline" field="deadline" />
				<FormSearchText />
				<SearchResults ref={function (self) {
					form.searchResults = self;
					performSearch(null, function (r) {
						self.setState({results : r});
					});
				}} />
			</div>);
	}
});

var SearchResult = React.createClass({
	getInitialState : function () {
		return {canAdd : data.allSelected.indexOf(this.props.place.id) === -1};
	},
	render : function () {
		return (
			<tr>
				<td>
					<div className="row container-fluid">
						{this.props.place.name}
						<div className="pull-right">
							{this.renderButton()}
						</div>
					</div>
				</td>
			</tr>);
	},
	renderButton : function () {
		if (this.state.canAdd)
			return (<Button bsSize="xsmall" bsStyle="success" onClick={this.handleClick}>Add</Button>)
		else
			return (<Button bsSize="xsmall" bsStyle="danger" onClick={this.handleClick}>Remove</Button>);
	},
	handleClick : function () {
		var here = this.props.place;
		if (this.state.canAdd)
			data.allSelected.push(here.id);
		else
			data.allSelected = data.allSelected.filter(function (pl) { return pl != here.id; });

		this.setState({canAdd : !this.state.canAdd})
		form.submitButton.forceUpdate();
	}
});
var SearchResults = React.createClass({
	getInitialState : function () {
		return {results : []};
	},
	render : function () {
		return (
			<Table striped className="search-results-table">
				<tbody>
				{this.state.results.map(function (data, i) {
					return (<SearchResult place={data} key={data.id} />)
				})}
				</tbody>
			</Table>);
	}
});
var InputText = React.createClass({
	render : function () {
		return (
			<div className="container-fluid">
				<label className="">{this.props.label}:</label>
				<input type={this.props.kind} placeholder={this.props.label} onChange={this.handleChange} className="form-control" />
			</div>);
	},
	handleChange : function (e) {
		var val = e.target.value;
		data[this.props.field] = val;
		form.submitButton.forceUpdate();
	}
})
var FormSearchText = React.createClass({
	render : function () {
		return (
			<input type="text" placeholder="Search..."
			       autofocus="yes" className="form-control" onChange={this.handleChange} />);
	},
	handleChange : function (e) {
		var val = e.target.value;
		console.log(val);

		performSearch(val, function (r) {
			form.searchResults.setState({results : r});
		});
		form.submitButton.forceUpdate();
	}
});
var SubmitButton = React.createClass({
	render : function () {
		var enabled = true;
		if (data.allSelected.length === 0)
			enabled = false;
		else if (data.eventName.trim().length === 0)
			enabled = false;

		return (
			<Button style={{width: "100%"}} bsStyle="primary" disabled={!enabled}>{"Night out"}</Button>);
	}
});

function Location (name, address, id) {
	return { name : name, address : address, id : id };
}



ReactDOM.render(
	<Everything />,
	document.getElementById("allPlaces"));