
(function() {
    
    'use strict';

      
    var GORILLA_GURU_PROFILE_LIST_API_ID = 1;

    var handler = function(event) {
      console.log('event', event);
      var record = event.record;
      var guruName = record.name.value;
      var bioText = record.bio.value;

      return kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
        app: GORILLA_GURU_PROFILE_LIST_API_ID,
        updateKey: {
          field: 'name',
          value: guruName
        },
        record: {
          bio: {
            value: bioText
          }
        }
      }).then(function(response) {
        console.log(response);
        return event;
      }).catch(function(error) {
        console.log(error);
        var message = 'Error Occurred';
        event.error = event.error ? event.error + message : message;
        return event;
      });
    };
  
    kintone.events.on([
      'app.record.create.submit',
      'app.record.edit.submit',
      'app.record.index.edit.submit'
    ], handler);
  
  })();