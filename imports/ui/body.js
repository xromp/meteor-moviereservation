import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Movies } from '../api/movies.js';
import { Seats } from '../api/seats.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    this.addNewmovie = new ReactiveVar(0);
})

Template.body.helpers({
    movies(){
        const instance = Template.instance()
        var movies = Movies.find({}).fetch();
        return movies;
    },
    movieperseats(){
        const instance = Template.instance();
        var movieIdSelected = instance.state.get('selectMovie');

        if (!movieIdSelected) {
            var getFirstMovie = Movies.find({}).fetch()[0];
            return Seats.find({movieid:getFirstMovie._id}).fetch();    
        }
        return Seats.find({movieid:movieIdSelected}).fetch();
    }
});

Template.body.events({
    'click .selectMovie'(event, instance){
        instance.state.set('selectMovie', this._id);
    },
    'click .add-newmovie'(event, instance){
        var state = instance.state.get('addNewmovie') ? true : false;
        instance.addNewmovie.set(!state);
    },
    'click .reserved-seat'(event, instance){
        // I don't used boolean here might also have cancelled status
        var status = this.status == 'RESERVED' ? '' : 'RESERVED'
        Seats.update(this._id,
            {
                $set:{status : status}
            })
    },
    'submit .newMovie'(event) {
        event.preventDefault();

        var target = event.target;
        var formData = {
            title:target.title.value,
            desc:target.description.value,
            showingdate:target.showingdate.value,
            capacity:target.showingdate.value
        };
        console.log("formData",formData);

        Movies.insert(formData);
    },
    
})