import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Movies } from '../api/movies.js';
import { Seats } from '../api/seats.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    this.addNewmovie = new ReactiveVar(0);
    Meteor.subscribe('movies');
    Meteor.subscribe('seats');
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
        console.log(Seats.find({movieid:movieIdSelected}).fetch());
        return Seats.find({movieid:movieIdSelected}).fetch();
    },
    isaddnewmovie() {
        return Session.get('isAddNewMovie')
    }
});

Template.body.events({
    'click .selectMovie'(event, instance){
        instance.state.set('selectMovie', this._id);
        Session.set('isAddNewMovie',true);
    },
    'click .add-newmovie'(event, instance){
        var i  = Session.get('isAddNewMovie');
        Session.set('isAddNewMovie',!i);
    },
    'click .reserved-seat'(event, instance){
        // I don't used boolean here might also have cancelled status
        var status = this.status == 'RESERVED' ? '' : 'RESERVED'
        var formData = {
            seatid:this._id,
            status:status
        };
        Meteor.call('seats.setReserved', formData, function(error, result){
            alert(error.reason);
        });
    },
    'submit .newMovie'(event) {
        event.preventDefault();

        var target = event.target;
        var formData = {
            title:target.title.value,
            desc:target.description.value,
            showingdate:target.showingdate.value,
            capacity:target.capacity.value,
            banner:target.banner.value,
            frame:target.frame.value
        };

        Meteor.call('movies.insert', formData);
        Session.set('isAddNewMovie',true);
    },
    'click .cancel-newmovie'() {
        Session.set('isAddNewMovie',true);
    }
    
})