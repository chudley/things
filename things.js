Things = new Meteor.Collection("things");

if(Meteor.is_client){
	Template.thing_list.things = function(){
		return Things.find({}, {sort: {likes: -1, name: 1}});
	};
	
	Template.thing_list.events = {
		'click button.like': function(){
			var thing = Things.findOne({_id: Session.get("session_thing")});
			Things.update(thing, {$inc: {likes: 1}});
			console.log("Liked " + thing.name + " (" + thing._id + ")");
		},
		'click button.dislike': function(){
			var thing = Things.findOne({_id: Session.get("session_thing")});
			Things.update(thing, {$inc: {dislikes: 1}});
			console.log("Disliked " + thing.name + " (" + thing._id + ")");
		},
		'keyup #new': function(evt){
			if(evt.which == 13){
				var text = $('#new').val();
				if(text.length < 1) {
					console.log('attempting empty string');
					$('#message').html("That isn't a thing!");
				}
				else if(Things.findOne({name: text})){
					$('#message').html("Already there!");
				}
				else{
					$('#message').html("");
					$('#new').val("");
					var thing = Things.findOne({_id: Things.insert({name: text, likes: 0, dislikes: 0})}); // Don't know an easier way to do this
					console.log("Added " + thing.name + " (" + thing._id + ")");
				}
			}

		}
	};

	Template.thing_info.maybe_selected = function(){
		return Session.equals("session_thing", this._id) ? "selected" : "";
	};

	Template.thing_info.how_many = function(){
		if(this.likes > this.dislikes){
			//favourable
			return "People like "
		}
		else if(this.likes < this.dislikes) {
			//not favourable
			return "People dislike "
		}
		else {
			//neutral
			return "People are undecided about "
		}
	};
	Template.thing_info.events = {
		'click': function(){
			Session.set("session_thing", this._id);
			console.log("session_thing changed to " + this._id);
		}
	};
}
