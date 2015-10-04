import Ember from 'ember';

/*global google*/

export default Ember.Namespace.create({
  map: {
    type(type) {
      let mappedType;

      switch (type) {
        case "roadmap":
          mappedType = google.maps.MapTypeId.ROADMAP;
          break;
        case "satellite":
          mappedType = google.maps.MapTypeId.SATELLITE;
          break;
        case "terrain":
          mappedType = google.maps.MapTypeId.TERRAIN;
          break;
        case "hybrid":
          mappedType = google.maps.MapTypeId.HYBRID;
          break;
        default:
          mappedType = google.maps.MapTypeId.ROADMAP;
      }

      return mappedType;
    },

    encodeEventAction(eventName) {
      const eventMapper = {
        click: 'mapClickAction',
        bounds_changed: 'mapBoundsChangedAction',
        center_chanced: 'mapCenterChangedAction',
        dblclick: 'mapDoubleClickAction',
        rightclick: 'mapRightClickAction',
        tilesloaded: 'mapTilesLoadedAction',
        zoom_changed: 'mapZoomChangedAction',
        drag: 'mapDragAction',
        dragend: 'mapDragEndAction',
        dragstart: 'mapDragStartAction',
        heading_changed: 'mapHeadingChangedAction',
        idle: 'mapIdleAction',
        maptypeid_changed: 'mapTypeIdChangedAction',
        projection_changed: 'mapProjectionChangedAction',
        mousemove: 'mapMouseMoveAction',
        mouseup: 'mapMouseUpAction',
        mousedown: 'mapMouseDownAction',
        mouseover: 'mapMouseOverAction',
        mouseout: 'mapMouseOutAction'
      };

      return eventMapper[eventName];
    }
  },

  marker: {
    decodeEventName(eventName) {
      const alias = {}[eventName];

      Ember.assert(`there is no mapping for the following event name: ${eventName}`, !!alias);

      return alias;
    },

    encodeEventAction(eventName) {
      const eventMapper = {
        'animation_changed': 'markerAnimationChangedAction',
        'click': 'markerClickAction',
        'clickable_changed': 'markerClickableChangedAction',
        'cursor_changed': 'markerCursorChangedAction',
        'dblclick': 'markerDoubleClickAction',
        'drag': 'markerDragAction',
        'dragend': 'markerDragEndAction',
        'draggable_changed': 'markerDraggableChangedAction',
        'dragstart': 'markerDragStartAction',
        'flat_changed': 'markerFlatChangedAction',
        'icon_changed': 'markerIconChangedAction',
        'mousedown': 'markerMouseDownAction',
        'mouseout': 'markerMouseOutAction',
        'mouseover': 'markerMouseOverAction',
        'mouseup': 'markerMouseUpAction',
        'position_changed': 'markerPositionChangedAction',
        'rightclick': 'markerRightClickAction',
        'shape_changed': 'markerShapeChangedAction',
        'title_changed': 'markerTitleChangedAction',
        'visible_changed': 'markerVisibleChangedAction',
        'zindex_changed': 'markerZIndexChangedAction'
      };

      return eventMapper[eventName];
    }
  }
});
