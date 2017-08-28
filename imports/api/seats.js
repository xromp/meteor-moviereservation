import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Seats = new Mongo.Collection('seats');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('seats', function seatsPublication() {
      return Seats.find();
    });
}

Meteor.methods({
    'seats.setReserved'(data) {
        var seatSelected = Seats.find({ _id : data.seatid }).fetch()[0];
        
        if (seatSelected.status == 'RESERVED' && seatSelected.userId != Meteor.userId()){
            var errmsg  = "Seat no."+ seatSelected.seatNo + " has already reserved."
            throw new Meteor.Error("create-failed", errmsg);
        }
        if (!Meteor.userId()) {
            var errmsg  = "Should SignIn First."
            throw new Meteor.Error("create-failed", errmsg);
        }
        Seats.update(data.seatid,
            {
                $set:{
                    status : data.status,
                    reservedBy: Meteor.userId(),
                    userId:Meteor.userId(),
                    reservedAt: new Date()
                }
            })
      },
  })
  