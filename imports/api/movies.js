import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {Seats} from './seats.js';

export const Movies = new Mongo.Collection('movies');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('movies', function moviesPublication() {
      return Movies.find();
    });
}
 
  
Meteor.methods({
    'movies.insert'(data) {
    //   check(text, String);
   
      // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
    }
     var formData = {
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
        title:data.title,
        desc:data.desc,
        showingdate:data.showingdate,
        capacity:data.capacity,
        banner:data.banner,
        frame:data.frame,
      };

    if (Movies.find({}).fetch().length == 1){
        formData.isFirst = true;
    }

      var movieId = Movies.insert(formData);

      for(var i=1; i<= data.capacity; i++){
        Seats.insert({movieid:movieId, seatNo:i });
      }
    },
  })