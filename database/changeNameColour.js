(function() {
    'use strict';
      
    var changeNameFieldColor = function(params) {
      var element = params.element;
      var value = params.value;
      var backgroundColor;
      var fontWeight;
      switch (value) {
        case 'Thurka':
          backgroundColor = '#FED101';
          break;      
        case 'Closed-Lost':
          backgroundColor = '#C6C3C3';
          break;
        default:
          break;
      }
        
  
      if (backgroundColor) {
        element.style.backgroundColor = backgroundColor;
      }
      if (fontWeight) {
        element.style.fontWeight = fontWeight;
      }
    };
  
    kintone.events.on('app.record.detail.show', function(event) {
      var record = event.record;
      var guruName = record.name.value;
      var guruNameElement = kintone.app.record.getFieldElement('name');
      changeNameFieldColor({element: guruNameElement, value: guruName});
      return event;
    });
  
    kintone.events.on('app.record.index.show', function(event) {
      var records = event.records;
      var guruNameElements = kintone.app.getFieldElements('name');
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var guruName = record.name.value;
        var guruNameElement = salesStageElements[i];
        changeNameFieldColor({element: guruNameElement, value: guruName});
      }
      return event;
    });
  
  })();