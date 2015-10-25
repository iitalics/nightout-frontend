var form = window["__form"] = {};
var data = window["__data"] = {};

data.eventName = "Event Name";
data.time = "" + new Date();
data.deadline = "" + new Date();
data.allSelected = [];

var SearchResult = React.createClass({
	getInitialState : function () {
		return {canAdd : data.allSelected.indexOf(this.props.place.id) === -1};
	},
	render : function () {
		return (
			<tr>
				<td>
					<div className="row container-fluid">
						<div className="pull-left">{this.props.place.name}</div>
						<div className="pull-right">
							{this.renderButton()}
						</div>
					</div>
				</td>
			</tr>);
	},
	renderButton : function () {
		if (this.state.canAdd)
			return (<button className="btn btn-xs btn-success" onClick={this.handleClick}>Add</button>);
		else
			return (<button className="btn btn-xs btn-danger" onClick={this.handleClick}>Remove</button>);
	},
	handleClick : function () {
		var here = this.props.place;
		if (this.state.canAdd)
			data.allSelected.push(here.id);
		else
			data.allSelected = data.allSelected.filter(function (pl) { return pl.id !== here.id; });

		this.setState({canAdd : !this.state.canAdd})
	}
});
var SearchResults = React.createClass({
	getInitialState : function () {
		return {results : []};
	},
	render : function () {
		return (
			<table className="table table-striped">
				<tbody>
				{this.state.results.map(function (data, i) {
					return (<SearchResult place={data} key={data.id} />)
				})}
				</tbody>
			</table>);
	}
});
var FormInput
var FormSearchText = React.createClass({
	render : function () {
		return (
			<input type="text" placeholder="Search..." autofocus="yes" className="form-control" onChange={this.handleChange} />);
	},
	handleChange : function (e) {
		var val = e.target.value;
		console.log(val);

		performSearch(val, function (r) {
			form.searchResults.setState({results : r});
		});
	}
});

function Location (name, address, id) {
	return { name : name, address : address, id : id };
}



var everything = [
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
		for (var i = 0; i < everything.length; i++) 
			if (find(everything[i]) !== -1)
				r.push(everything[i]);

		r = r.sort(function (a, b) {
			return find(a) - find(b);
		});
	}
	else
		r = everything;

	setTimeout(function () {
		cb(r);
	}, 100);
}



ReactDOM.render(
	<div className="container">
		<div className="container-fluid row">
			<label className="pull-left col-sm-5">Time:</label>
			<input type="time" className="form-control pull-right col-sm-5" />
		</div>
		<FormSearchText />
		<SearchResults ref={function (self) {
			form.searchResults = self;

			performSearch(null, function (r) {
				self.setState({results : r});
			});
		}} />
	</div>,
	document.getElementById("everything"));