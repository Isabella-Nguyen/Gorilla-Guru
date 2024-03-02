(function() {
  'use strict';

  var changeNameFieldColor = function(params){
    var element = params.element;
    var value = params.value;
    var backgroundColor;

    switch(value){
        case 'Thurka':
        backgroundColor = 'FED101';
        break;
    default:
        break;
    }

    if (backgroundColor){
        element.style.backgroundColor = backgroundColor;
    }
  }

  kintone.events.on('app.record.detail.show', function(event) {
    var record = event.record;
    var name = record.name.value;
    var nameElement = kintone.app.record.getFieldElement('name');
    changeNameFieldColor({element: nameElement, value: name});
    return event;
  });

  kintone.events.on('app.record.index.show', function(event) {
    var records = event.records;
    var nameElements = kintone.app.getFieldElements(fieldcode);
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      var name = record.name.value;
      var nameElement = nameElements[i];
      changeNameFieldColor({element: nameElement, value: name});
    }
    return event;
  });

})();