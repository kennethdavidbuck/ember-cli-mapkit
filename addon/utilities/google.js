
import Ember from 'ember';

/*global google*/

const {assert} = Ember;

export default Ember.Namespace.create({

  map: {
    encodeMapType(type) {
      let mappedType;

      switch (type) {
        case google.maps.MapTypeId.ROADMAP:
          mappedType = "roadmap";
          break;
        case google.maps.MapTypeId.SATELLITE:
          mappedType = "satellite";
          break;
        case google.maps.MapTypeId.TERRAIN:
          mappedType = "terrain";
          break;
        case google.maps.MapTypeId.HYBRID:
          mappedType = "hybrid";
          break;
        default:
          mappedType = "roadmap";
      }

      return mappedType;
    },

    decodeMapType(type) {
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

    decodeEventName(eventName) {
      const alias = {
        click: 'click',
        boundsChanged: 'bounds_changed',
        centerChanged: 'center_changed',
        doubleClick: 'dblclick',
        rightClick: 'rightclick',
        tilesLoaded: 'tilesloaded',
        zoomChanged: 'zoom_changed',
        drag: 'drag',
        dragEnd: 'dragend',
        dragStart: 'dragstart',
        headingChanged: 'heading_changed',
        idle: 'idle',
        mapTypeIdChanged: 'maptypeid_changed',
        projectionChanged: 'projection_changed',
        mouseMove: 'mousemove',
        mouseUp: 'mouseup',
        mouseDown: 'mousedown',
        mouseOver: 'mouseovern',
        mouseOut: 'mouseout'
      }[eventName];

      assert(`there is no event mapping for the following map event name: ${eventName}`, !!alias);

      return alias;
    },

    encodeEventAction(eventName) {
      const alias = {
        click: 'mapClickAction',
        bounds_changed: 'mapBoundsChangedAction',
        center_changed: 'mapCenterChangedAction',
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
      }[eventName];

      assert(`there is no action mapping for the following map event name: ${eventName}`, !!alias);

      return alias;
    }
  },

  marker: {
    decodeEventName(eventName) {
      const alias = {
        click: 'click',
        animationChanged: 'animation_changed',
        clickableChanged: 'clickable_changed',
        cursorChanged: 'cursorChanged',
        doubleClick: 'dblclick',
        drag: 'drag',
        dragEnd: 'dragend',
        draggableChanged: 'draggable_changed',
        dragStart: 'dragstart',
        flatChanged: 'flat_changed',
        iconChanged: 'icon_changed',
        mouseDown: 'mousedown',
        mouseOut: 'mouseout',
        mouseOver: 'mouseover',
        mouseUp: 'mouseup',
        positionChanged: 'position_changed',
        rightClick: 'rightclick',
        shapeChanged: 'shape_changed',
        titleChanged: 'title_changed',
        visibleChanged: 'visible_changed',
        zindex_changed: 'zindex_changed'
      }[eventName];

      assert(`there is no event mapping for the following marker event name: ${eventName}`, !!alias);

      return alias;
    },

    encodeEventAction(eventName) {
      const alias = {
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
      }[eventName];

      assert(`there is no action mapping for the following event name: ${eventName}`, !!alias);

      return alias;
    }
  }
});
